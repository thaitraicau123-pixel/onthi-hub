# ÔnThiHub 📚 - Nền Tảng Kho Flashcard Anki & Đề Thi Tuyển Dụng Chuẩn 2026

Dự án website thương mại điện tử sản phẩm số (Digital Products SaaS) tối ưu cho việc **tạo dòng tiền tức thì (Monetization)**.

---

## 🚀 Tính Năng Đã Hoàn Thiện

1. **Thư viện sản phẩm số & Flashcard thực tế:**
   - 🏛️ **Thi Công Chức / Viên Chức 2026:** Trọn bộ đề thi Kiến thức chung Bộ Nội Vụ (Luật CBCC, Hiến pháp 2013, Nghị định 138/2020/NĐ-CP).
   - 💻 **Phỏng Vấn Lập Trình IT:** 250 câu Frontend Master (React 19, JS Core, Web Vitals, SSR) & 200 câu Backend/System Design (Distributed Systems, Cache, Indexing).
   - 🌍 **Chứng Chỉ Ngoại Ngữ:** 1200 từ vựng IELTS Band 7.5+, 600 từ vựng & bẫy ngữ pháp TOEIC 850+, 1500 Kanji & Ngữ pháp JLPT N3-N2.

2. **Trình Lật Thẻ Anki 3D Trực Tiếp (Interactive Player):**
   - Lật thẻ 3D mượt mà (chạm hoặc bấm `Space`/`Enter`).
   - Đánh giá Spaced Repetition (Lại: 1, Khó: 2, Tốt: 3, Dễ: 4).
   - Phát âm thanh tự động (Web Speech API đa ngôn ngữ: Anh, Nhật, Trung, Việt).
   - Hiệu ứng âm thanh sinh học (Web Audio API Synthesizer).

3. **Phòng Thi Thử Trắc Nghiệm Tính Giờ (Mock Exam):**
   - Đếm ngược thời gian làm bài.
   - Chấm điểm tự động và tung pháo hoa ăn mừng (Canvas Confetti).
   - Giải thích chi tiết căn cứ điều luật & bản chất kỹ thuật cho từng câu hỏi.

4. **Cổng Thanh Toán Tự Động VietQR (Chuẩn SePay / Napas247):**
   - Sinh mã QR động ngân hàng kèm số tiền và mã đơn hàng duy nhất (`ONTHI_XXXXXX`).
   - Hỗ trợ đổi STK nhận tiền thật của bạn ngay trên giao diện hoặc trong cấu hình.
   - Nút kiểm tra giao dịch tự động mở khóa vĩnh viễn trong 3 giây.
   - Hỗ trợ mã giảm giá (`KHAITRUONG`, `VIP2026`, `PASSNHANH`).

5. **Xuất File & Bản Quyền Tải Về:**
   - Xuất file `.txt` chuẩn Anki nạp 1 chạm vào app Anki trên iOS/Android/PC (có gắn UTF-8 BOM chống lỗi tiếng Việt).
   - Trình xuất file PDF / In tóm tắt chuyên nghiệp.
   - Tủ tài liệu lưu trữ vĩnh viễn trên trình duyệt của người mua.

---

## 🛠️ Hướng Dẫn Chạy & Triển Khai

### 1. Chạy trên máy nội bộ
```bash
cd onthi-hub
npm install
npm run dev
```
Mở trình duyệt: `http://localhost:5173`

### 2. Triển khai Online Miễn Phí (Vercel / Cloudflare Pages / Netlify)
- Đẩy code lên GitHub.
- Vào [Vercel](https://vercel.com) hoặc [Cloudflare Pages](https://pages.cloudflare.com), kết nối repo và bấm **Deploy**.
- Web sẽ có link public (ví dụ: `https://onthi-hub.vercel.app`) để bắt đầu chia sẻ và bán hàng ngay lập tức!

---

## ✨ AI Prompt Studio (Respan Gateway)

Nút **“✨ Cá nhân hoá prompt”** trong cửa sổ đã mở khoá Hộp Công Cụ Prompts sẽ nhờ AI
viết lại Master Prompt cho đúng dự án của người mua (ngành, kênh, đối tượng, phong cách).
Prompt gốc vẫn giữ nguyên khung; AI chỉ thay phần bối cảnh và ví dụ.

Mọi lệnh gọi model đi qua **[respan-gateway](https://github.com/respanai/respan-gateway?utm_source=freebuff&utm_medium=paid&utm_campaign=respan-gateway&bfcid=bfc_1.eyJpZCI6IjA2ODJkYWNhLTY0MzktNDQ3ZS04MjIxLWMxNDhjNDc5YjA1OCIsImMiOiIyMDM2ODZkZS1mMzg0LTQ4NTQtYmViNC1hYzBiYWRmNmM1NTUiLCJrIjoiM2IxMGE4YmUtNzgyOS00MmJhLWFmNmEtYmI0YWUxZTRhY2Y4IiwiaWF0IjoxNzk0MjI5MTM2fQ.JDoE-G1peABKpxeUfC6KQ2Eski-mle0Qv8_Oxizc658)** v0.3.0,
chạy **in-process** (không cần server riêng) và dùng chính key nhà cung cấp của bạn.
Đổi nhà cung cấp chỉ cần đổi biến `GATEWAY_MODEL`, không phải sửa code client.

### Các file liên quan

| File | Việc của nó |
|---|---|
| `api/ai.py` | Vercel Python Function: xác thực Firebase ID token → gọi model qua `respan_gateway` |
| `requirements.txt` | Khai báo `respan-gateway==0.3.0` + `openai` cho Python runtime của Vercel |
| `js/views/modal.js` | Nút “✨ Cá nhân hoá prompt”, ô mô tả dự án, khung kết quả + nút sao chép |
| `test/respan-gateway.test.py` | Kiểm thử tích hợp: handler thật → gateway → provider giả lập trên 127.0.0.1 |

### Cài đặt (một lần)

```bash
python3 -m venv .venv
.venv/bin/pip install --only-binary=:all: -r requirements.txt
```

Sau đó khai báo biến môi trường (xem mẫu trong `.env.example`):

1. `OPENAI_API_KEY` (hoặc `ANTHROPIC_API_KEY` / `GEMINI_API_KEY`) — key nhà cung cấp của bạn.
   Trên Vercel: **Settings → Environment Variables**. Khi chạy máy: file `.env.local` (đã gitignore).
2. `FIREBASE_WEB_API_KEY` — API key web công khai trong Firebase Console (Project settings → Your apps).
   Server dùng key này để kiểm tra Firebase ID token trước khi gọi model.
3. `GATEWAY_MODEL` — tuỳ chọn, mặc định `gpt-4o-mini`. Đặt `claude-*` hoặc `gemini-*` để gateway
   tự route sang nhà cung cấp tương ứng (cần key của nhà cung cấp đó).

Không cần tài khoản Respan, không cần `RESPAN_API_KEY`, không gửi tracing đi đâu.

### Kiểm thử cục bộ

```bash
.venv/bin/python test/respan-gateway.test.py
```

Bài test dựng một provider OpenAI **giả lập** trên `127.0.0.1` rồi trỏ gateway sang đó bằng
`RESPAN_OPENAI_BASE_URL`, nên **không cần key thật và không gọi mạng ra ngoài**.
Kết quả đã chạy trong repo này: **4/4 test pass** — chặn khi thiếu/sai token (401), chặn khi thiếu
prompt (400), và một lượt đầy đủ trả về prompt mới do provider giả lập sinh ra, đúng 1 request
`POST /v1/chat/completions` với model `gpt-4o-mini`.
**Chưa xác minh lệnh gọi nhà cung cấp thật** (môi trường này không có key nhà cung cấp) — hãy thử
một lần trên Vercel hoặc máy có key để xác nhận.

### Dùng trên web

1. Đăng nhập → mở một Hộp Công Cụ Prompts đã mua.
2. Bấm **✨ Cá nhân hoá prompt**, mô tả dự án của bạn (≥ 10 ký tự), bấm **Tạo bản tối ưu**.
3. Bấm **Sao chép bản tối ưu** rồi dán vào ChatGPT / Claude / Cursor như bình thường.

Lệnh chạy app như cũ: `npm install && npm run build` (Vercel tự chạy `build.cjs`),
hoặc mở trực tiếp `index.html` bằng một static server cục bộ.
