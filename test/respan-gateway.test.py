"""
test/respan-gateway.test.py
Kiểm thử tích hợp (chạy local) cho workflow "AI Prompt Studio" qua Respan Gateway:
  POST /api/ai (handler thật của api/ai.py) → respan-gateway in-process
  → provider OpenAI giả lập trên 127.0.0.1 (không cần key thật)

Gateway được trỏ sang provider giả bằng biến môi trường RESPAN_OPENAI_BASE_URL.
Xác thực Firebase được thay bằng hàm giả (không có token thật trong môi trường test).

Chạy: .venv/bin/python test/respan-gateway.test.py
"""

import importlib.util
import json
import os
import pathlib
import threading
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib import error, request

ROOT = pathlib.Path(__file__).resolve().parent.parent
FIXTURE_REPLY = "PROMPT TỐI ƯU TỪ FIXTURE\n\nBối cảnh: landing page khoá học tiếng Anh cho người đi làm."

seen_requests = []


class FakeOpenAIProvider(BaseHTTPRequestHandler):
    def log_message(self, *args):  # tắt log ồn
        pass

    def do_POST(self):
        size = int(self.headers.get("content-length") or 0)
        body = json.loads(self.rfile.read(size) or b"{}")
        seen_requests.append({"path": self.path, "body": body, "auth": self.headers.get("authorization")})
        payload = {
            "id": "chatcmpl-fixture",
            "object": "chat.completion",
            "created": 0,
            "model": body.get("model") or "fixture",
            "choices": [{
                "index": 0,
                "finish_reason": "stop",
                "message": {"role": "assistant", "content": FIXTURE_REPLY},
            }],
            "usage": {"prompt_tokens": 10, "completion_tokens": 10, "total_tokens": 20},
        }
        raw = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(raw)))
        self.end_headers()
        self.wfile.write(raw)


def load_endpoint():
    spec = importlib.util.spec_from_file_location("promptmmo_api_ai", ROOT / "api" / "ai.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class GatewayPromptStudioTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.provider = HTTPServer(("127.0.0.1", 0), FakeOpenAIProvider)
        threading.Thread(target=cls.provider.serve_forever, daemon=True).start()
        provider_port = cls.provider.server_address[1]

        os.environ["OPENAI_API_KEY"] = "fixture-key"
        os.environ["RESPAN_OPENAI_BASE_URL"] = f"http://127.0.0.1:{provider_port}/v1"
        os.environ.pop("ANTHROPIC_API_KEY", None)
        os.environ.pop("GEMINI_API_KEY", None)
        os.environ.pop("GATEWAY_MODEL", None)
        os.environ.pop("FIREBASE_WEB_API_KEY", None)

        cls.endpoint = load_endpoint()
        cls.endpoint._lookup_firebase_user = lambda token: (
            {"uid": "fixture-uid", "email": "fixture@example.com"} if token == "valid-fixture-token" else None
        )

        cls.server = HTTPServer(("127.0.0.1", 0), cls.endpoint.handler)
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()
        cls.base_url = f"http://127.0.0.1:{cls.server.server_address[1]}/api/ai"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.provider.shutdown()

    def post(self, body, token="valid-fixture-token"):
        raw = json.dumps(body).encode("utf-8")
        headers = {"Content-Type": "application/json"}
        if token:
            headers["Authorization"] = "Bearer " + token
        req = request.Request(self.base_url, data=raw, headers=headers, method="POST")
        try:
            with request.urlopen(req, timeout=60) as res:
                return res.status, json.loads(res.read() or b"{}")
        except error.HTTPError as err:
            return err.code, json.loads(err.read() or b"{}")

    def test_requires_login(self):
        status, payload = self.post({"prompt": "Viết content"}, token="")
        self.assertEqual(status, 401)
        self.assertFalse(payload["ok"])
        self.assertEqual(payload["code"], "unauthorized")

    def test_rejects_invalid_token(self):
        status, payload = self.post({"prompt": "Viết content"}, token="forged")
        self.assertEqual(status, 401)

    def test_rejects_missing_prompt(self):
        status, payload = self.post({"context": "Shop bán khoá học"})
        self.assertEqual(status, 400)
        self.assertEqual(payload["code"], "missing_prompt")

    def test_personalizes_prompt_through_gateway(self):
        seen_requests.clear()
        status, payload = self.post({
            "prompt": "Bạn là chuyên gia content marketing. Viết 10 caption Facebook.",
            "context": "Tôi bán khoá học tiếng Anh cho người đi làm, khách 25-35 tuổi.",
            "productName": "Hộp Công Cụ Prompts Content Marketing",
        })

        self.assertEqual(status, 200, payload)
        self.assertTrue(payload["ok"])
        self.assertEqual(payload["prompt"], FIXTURE_REPLY)
        self.assertEqual(payload["model"], "gpt-4o-mini")

        # Provider giả phải nhận đúng 1 request chat completion qua gateway.
        self.assertEqual(len(seen_requests), 1)
        call = seen_requests[0]
        self.assertEqual(call["path"], "/v1/chat/completions")
        self.assertEqual(call["body"]["model"], "gpt-4o-mini")
        messages = call["body"]["messages"]
        self.assertEqual(messages[0]["role"], "system")
        self.assertIn("Master Prompt", messages[0]["content"])
        self.assertIn("khoá học tiếng Anh cho người đi làm", messages[1]["content"])
        self.assertIn("Viết 10 caption Facebook", messages[1]["content"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
