# HƯỚNG DẪN NẠP XU QUA SEPAY — LÀM THEO TỪNG BƯỚC

Tài liệu này dành cho **bất kỳ ai** (kể cả không biết lập trình) cần bật / kiểm tra / sửa tính năng nạp Xu tự động của web **https://www.promptmmo.store**.

Đọc xong bạn sẽ biết: ai phải làm gì, bấm vào đâu, kiểm tra bằng cách nào, và khi tiền không vào ví thì xem ở đâu.

---

## 0. Hiểu nhanh trong 30 giây

Có **3 nhân vật** tham gia:

| Nhân vật | Việc của họ |
|---|---|
| **Khách** | Đăng nhập web → bấm Nạp Xu → lấy **mã nạp** (`NAPXU` + 8 ký tự) → chuyển khoản ghi đúng mã đó vào nội dung |
| **SePay** | Ngân hàng báo có tiền về → SePay gọi vào web (gọi là *webhook*) để báo "đã nhận 20.000đ, nội dung là ..." |
| **Server web** | Đọc mã trong nội dung → tìm xem mã đó của khách nào → **cộng Xu vào đúng ví của khách đó** và lưu trên Firestore (server), không phải trong máy khách |

Điểm quan trọng nhất: **số dư ví do server ghi, không do trình duyệt tự cộng**. Vì vậy đổi máy, xoá cache, dùng ẩn danh → tiền vẫn còn.

---

## 0.5. TÊN MIỀN CHÍNH THỨC: https://www.promptmmo.store (bắt buộc có `www`)

Web có **một** bản chạy chính thức: **https://www.promptmmo.store**. Địa chỉ `promptmmo.vercel.app` vẫn trỏ vào **cùng một bản code, cùng một database** — dữ liệu không bị tách đôi, chỉ khác cái tên miền trên thanh địa chỉ.

> ⚠️ **Bắt buộc dùng `www`:** gõ `https://promptmmo.store` sẽ bị Vercel trả **308 chuyển sang `https://www.promptmmo.store`**. Với request POST, nhiều hệ thống (kể cả SePay) không đi theo redirect → webhook coi như mất. Vì vậy URL webhook phải ghi **`https://www.promptmmo.store/api/sepay`** đúng như vậy.

Vì vậy cần để ý 3 điểm sau:

1. **Webhook SePay phải trỏ đúng tên miền chính thức:** `https://www.promptmmo.store/api/sepay`
   - Nếu webhook đang là `https://promptmmo.vercel.app/api/sepay` → sửa lại thành `.store`, hoặc thêm webhook mới rồi **tắt/xoá cái cũ**.
   - Để cả hai cùng bật vẫn **không cộng tiền 2 lần** (server chống trùng theo mã giao dịch), nhưng sẽ có 2 request cho mỗi lần chuyển khoản và log SePay bị rối — nên chỉ giữ 1.
2. **Nút Nạp Xu tự chạy đúng trên cả 2 tên miền** vì nó gọi API theo đường dẫn tương đối (`/api/topups`, `/api/sepay`). Trang Admin giờ cũng hiện URL webhook theo **tên miền bạn đang mở**, bấm Copy là dán được ngay vào SePay.
3. **Nếu đăng nhập Google báo lỗi `auth/unauthorized-domain`:** vào Firebase Console → **Authentication → Settings → Authorized domains → Add domain** → thêm `promptmmo.store`.
4. (Nên làm) Vercel → project **promptmmo** → **Settings → Domains**: `promptmmo.store` phải ở trạng thái **Valid**, và bật chế độ chuyển hướng `promptmmo.vercel.app` → `promptmmo.store` để khách không bị lạc sang tên miền phụ.

Các bước cấu hình bên dưới dùng tên miền chính thức `promptmmo.store`.

---

## 1. VIỆC PHẢI LÀM — chỉ làm 1 lần (dành cho quản trị viên)

Làm đủ 4 bước dưới đây thì tiền mới tự vào ví. Nếu thiếu bước 2 hoặc 3, web sẽ báo lỗi rõ ràng chứ không "báo thành công ảo".

### ☐ Bước 1 — Lấy "API Key" của webhook trong SePay

1. Đăng nhập **https://my.sepay.vn**
2. Vào **Cấu hình → Webhooks** (hoặc **Tích hợp → Webhook**)
3. Mở webhook đang trỏ tới `https://www.promptmmo.store/api/sepay`
   - Nếu chưa có, bấm **Thêm webhook** và tạo:
     - URL: `https://www.promptmmo.store/api/sepay`
     - Phương thức: **POST**
     - Sự kiện: **Có tiền vào** (tiền ra không cần)
     - Xác thực: **API Key**
4. Chọn **Authentication = API Key**, hệ thống hiện một chuỗi key → **bấm Copy** và giữ lại (đây là `SEPAY_WEBHOOK_SECRET`).

> Ghi chú: nếu SePay chỉ cho chọn "Không xác thực" thì web **sẽ từ chối** webhook (trả 401). Bắt buộc phải là API Key, vì đó là thứ duy nhất chứng minh request đến từ SePay.

### ☐ Bước 2 — Dán API Key đó vào Vercel

1. Vào **https://vercel.com** → chọn project **promptmmo** (repo `onthi-hub`)
2. **Settings → Environment Variables**
3. Bấm **Add**:
   - Name: `SEPAY_WEBHOOK_SECRET`
   - Value: dán chuỗi key vừa copy ở Bước 1
   - Environments: tick **Production** (và Preview nếu muốn test)
4. Save

### ☐ Bước 3 — Cho server quyền cộng Xu (Firebase Service Account)

Việc này chỉ để **server** ghi được số dư; khách không có quyền ghi ví.

1. Vào **https://console.firebase.google.com** → chọn project **promtmmo**
2. Bấm ⚙️ (góc trên trái) → **Project settings**
3. Tab **Service accounts** → bấm **Generate new private key** → **Generate key**
4. Máy tải về một file `.json`. Mở file đó bằng Notepad / TextEdit, **copy toàn bộ nội dung** (từ `{` đến `}`)
5. Quay lại Vercel → **Settings → Environment Variables → Add**:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: dán nguyên nội dung file JSON vừa copy
   - Environments: **Production**
6. Save

> ⚠️ File JSON này là "chìa khoá vạn năng" của Firebase. Không gửi qua chat, không đăng lên mạng, không commit vào code. Nếu lỡ lộ: vào Firebase → Service accounts → xoá key cũ và tạo key mới, rồi cập nhật lại Vercel.

### ☐ Bước 3b — Khai báo email admin (bắt buộc để dùng nút quản trị)

Từ 09/11/2026, các action cộng Xu tay / duyệt / khoá / reset số dư **yêu cầu đăng nhập bằng tài khoản admin**.
Nếu không khai báo, các nút đó trả 401/403 (đúng thiết kế — trước đây ai biết URL cũng gọi được và tự cộng 1.000.000 Xu).

Vercel → **Settings → Environment Variables → Add**:
- Name: `ADMIN_EMAILS`
- Value: email admin của bạn (ví dụ `tenban@gmail.com`); nhiều email thì cách nhau dấu phẩy
- Environment: **Production** → Save → **Redeploy**

(Dự phòng: tài khoản có `role: "admin"` hoặc `isAdmin: true` trong `users/{docId}` trên Firestore cũng được phép.)

### ☐ Bước 4 — Deploy lại và tự kiểm tra

1. Vercel → tab **Deployments** → bấm **Redeploy** (hoặc push code mới lên nhánh `main`)
2. Mở trình duyệt, vào địa chỉ này (chỉ cần xem, không cần đăng nhập):

   **https://www.promptmmo.store/api/sepay**

3. Kết quả đúng phải có 2 dòng:

   ```json
   "webhookSecretConfigured": true,
   "walletWritesConfigured": true
   ```

   - `webhookSecretConfigured: false` → Bước 2 chưa xong (hoặc chưa Redeploy).
   - `walletWritesConfigured: false` → Bước 3 chưa xong (hoặc JSON bị dán thiếu).

**Xong 4 bước này là hệ thống sẵn sàng.** Không cần làm lại nữa.

---

## 2. VIỆC PHẢI LÀM — mỗi lần muốn kiểm tra tiền có vào ví không (5 phút)

### ☐ Bài test 2.000đ (làm đúng thứ tự)

1. Mở web → **đăng nhập** bằng tài khoản của bạn (bắt buộc, nạp Xu yêu cầu đăng nhập).
2. Ghi lại số dư hiện tại (ví dụ **9.000 Xu**).
3. Bấm **Nạp Xu** → chọn gói **2.000** → màn hình hiện **mã nạp**, dạng:

   ```
   NAPXU7K2M9Q4B
   ```

   Bấm nút **Copy** cạnh mã.
4. Mở app ngân hàng (MBBank **0986019623 — BUI THAI**) và chuyển **2.000đ**.
   Ở ô **Nội dung / Lời nhắn**, dán **đúng mã** vừa copy — không thêm bớt, không gõ lại, không viết tiếng Việt có dấu.
5. Chờ **10–30 giây**, không cần tải lại trang.
6. Kết quả đúng:
   - Hiện thông báo xanh **"🎉 Nạp xu thành công!..."**
   - Số dư thành **11.000 Xu**
   - Mở lại web ở **điện thoại/máy khác** → vẫn **11.000 Xu** (đây là bằng chứng tiền nằm trên server).

### ☐ Bài test chống cộng trùng

Trong SePay, vào webhook → bấm **Gửi thử** (hoặc **Resend**) cho lại đúng giao dịch vừa rồi.

- Kết quả đúng: ví **vẫn 11.000 Xu**, không thành 13.000.
- Web trả về `"duplicate": true`.

---

## 3. KHI CÓ SỰ CỐ — tra bảng này trước khi hỏi ai

### 3.1. Khách báo "đã chuyển tiền mà không thấy Xu"

| Xem ở đâu | Xem gì | Kết luận |
|---|---|---|
| Trang web | Có báo lỗi gì khi bấm Nạp Xu? | "Phiên đăng nhập đã hết hạn" → khách đăng xuất/đăng nhập lại |
| SePay → Webhooks → **Lịch sử** | Có dòng gọi tới `/api/sepay` không? Mã HTTP bao nhiêu? | Không có dòng nào → SePay chưa gọi (sai URL, hoặc webhook đang tắt) |
| 〃 | Mã **401** | Sai/thiếu `SEPAY_WEBHOOK_SECRET` (Bước 2), hoặc SePay để Authentication = Không |
| 〃 | Mã **503** | Thiếu `FIREBASE_SERVICE_ACCOUNT` (Bước 3) |
| 〃 | Mã **400** | Webhook không gửi mã giao dịch (`id`) hoặc số tiền không hợp lệ |
| 〃 | Mã **200** nhưng `"matched": false` | **Sai mã nạp trong nội dung CK** → xem 3.2 |
| Firebase Console → Firestore | Mở collection `topup_intents` → tìm mã của khách | `status: pending` → chưa nhận được tiền đúng mã. `status: completed` → đã cộng xong |

### 3.2. Tiền vào nhưng `"matched": false` (không khớp mã)

Nguyên nhân theo thứ tự thường gặp:

1. Khách gõ lại mã bằng tay và sai 1 ký tự → **luôn Copy/Paste**.
2. Ngân hàng cắt bớt nội dung → dùng mã ngắn (chỉ `NAPXU` + 8 ký tự, không kèm tên).
3. Khách chuyển trước khi bấm Nạp Xu (chưa có mã) → phải bấm Nạp Xu **trước**, lấy mã rồi mới chuyển.
4. Khách chuyển vào **số tài khoản khác** → chỉ dùng **0986019623 (MBBank)**.
5. Chuyển **tiền ra / hoàn tiền** → web bỏ qua, không cộng (đúng thiết kế).

Mọi giao dịch không khớp đều được lưu lại ở collection **`topup_unmatched`** và có thông báo đẩy (ntfy) để xử lý tay. Muốn cộng bù cho khách: cộng trực tiếp ở trang **Admin → cộng Xu thủ công**, và **ghi lại mã giao dịch** vào `topup_unmatched` để không ai cộng lại lần 2.

### 3.3. Ví bị cộng 2 lần

Không thể xảy ra với giao dịch qua SePay: mỗi mã giao dịch SePay chỉ được ghi 1 lần (Firestore từ chối lần thứ 2). Nếu vẫn thấy cộng 2 lần thì đó là thao tác **cộng tay của admin**, kiểm tra lịch sử ở collection `topups`.

---

## 4. AI LÀM GÌ — bản tóm tắt 1 khung

| # | Việc | Ai làm | Bao lâu | Làm lại khi nào |
|---|---|---|---|---|
| 1 | Cấu hình Authentication = API Key trong SePay, copy key | Quản trị viên | 2 phút | Khi đổi/rotate key |
| 2 | Thêm biến `SEPAY_WEBHOOK_SECRET` trên Vercel | Quản trị viên | 1 phút | Khi đổi key |
| 3 | Tạo Service Account JSON, thêm biến `FIREBASE_SERVICE_ACCOUNT` trên Vercel | Quản trị viên | 5 phút | Khi rotate key Firebase |
| 4 | Redeploy + mở `/api/sepay` thấy 2 dòng `true` | Quản trị viên | 2 phút | Sau mỗi lần sửa cấu hình |
| 5 | Đăng nhập → Nạp Xu → copy mã → chuyển khoản đúng nội dung | Khách | 1 phút | Mỗi lần nạp |
| 6 | Kiểm tra ví bằng bài test 2.000đ | Bất kỳ ai | 5 phút | Khi khách báo lỗi / sau khi deploy |
| 7 | Xử lý giao dịch trong `topup_unmatched` | Quản trị viên | tuỳ | Khi có thông báo |

---

## 5. Những điều KHÔNG được làm

- ❌ Không dán key/JSON vào chat, email, ảnh chụp, hay commit vào code.
- ❌ Không sửa nội dung chuyển khoản của khách (thêm dấu, thêm tên, thêm chữ) — sẽ không khớp mã.
- ❌ Không tắt xác thực API Key của webhook "cho nhanh" — làm vậy ai biết URL cũng bơm được tiền ảo vào ví.
- ❌ Không tự cộng Xu bằng cách sửa localStorage/Console trình duyệt — số dư thật nằm trên server, sửa máy khách không có tác dụng (và sẽ bị ghi đè lại).

---

## 6. Ghi chú kỹ thuật (bỏ qua nếu bạn không phải dev)

- Webhook: `POST /api/sepay`, xác thực header `Authorization: Apikey <SEPAY_WEBHOOK_SECRET>` (so sánh constant-time).
- Mã nạp do server cấp: `NAPXU` + 8 ký tự, lưu ở `topup_intents/{memo}` gắn với email lấy từ **Firebase ID Token đã xác thực**.
- Cộng Xu: 1 transaction Firestore gồm 3 việc — tạo `topups/{sepayTxId}` với điều kiện *chưa tồn tại* (chống trùng), cộng `users/{docId}.balance`, đánh dấu intent `completed`.
- Client **chỉ đọc** số dư; đã bỏ hoàn toàn việc tự cộng Xu từ danh sách topup và `localStorage`.
- Kiểm thử tự động: `node test/sepay-flow.test.mjs` (12/12 case: auth, mã nạp, chống trùng, tiền ra, không khớp mã).
- Biến môi trường liên quan: `SEPAY_WEBHOOK_SECRET`, `FIREBASE_SERVICE_ACCOUNT`, `FIREBASE_PROJECT_ID` (mặc định `promtmmo`), `FIRESTORE_DATABASE` (mặc định `default`).

---

## 7. SỰ CỐ BẢO MẬT 09/11/2026 — API cộng Xu mở công khai (đã vá)

**Chuyện gì đã xảy ra:** endpoint `POST /api/topups` với `action: "direct_credit"` / `"approve"` / `"ban_user"` / `"reset_balance"` **không kiểm tra đăng nhập**. Bot quét lỗ hổng đã gọi thẳng và bắn thông báo giả vào ntfy:

```
12:50  ĐÃ DUYỆT NẠP +1 XU          → vuln-probe-092154c718@example.invalid
13:00  ĐÃ DUYỆT NẠP +1.000.000 XU  → banmuon@example.com  (mã TOPUP-DIRECT-…)
```

**Đã vá:** 4 action trên giờ bắt buộc **Firebase ID Token** của tài khoản nằm trong `ADMIN_EMAILS` (hoặc `role: "admin"` trong Firestore). Không token → 401, sai người → 403. Có 4 test tự động cho đúng các trường hợp này.

**Việc admin phải kiểm tra tay sau sự cố:**

1. Firebase Console → Firestore → collection `users`: tìm `banmuon_example_com`, `vuln_probe_…` — nếu có, **xoá document** hoặc đặt `balance: 0`.
2. Kiểm tra `orders` / đơn mua: nếu có đơn nào thanh toán bằng Xu của các tài khoản đó thì huỷ quyền mở khoá.
3. Kiểm tra `topups` có bản ghi `TOPUP-DIRECT-…` lạ → đánh dấu huỷ.
4. Đặt `ADMIN_EMAILS` trên Vercel rồi redeploy (bước 3b), nếu không các nút quản trị của bạn cũng bị chặn.
5. (Khuyến nghị) Topic ntfy `buithai_studio_0986019623` là **công khai**: ai cũng đọc và gửi được thông báo giả vào đó. Nên đổi sang topic riêng khó đoán hoặc bật ntfy auth. Tin cũ trên ntfy.sh tự hết hạn sau ~12 giờ.
6. (Khuyến nghị) `/cloud-db.json` vẫn public và chứa email khách — nên chặn hoặc bỏ file này khỏi repo.


## 8. Số dư ví chỉ do máy chủ ghi (10/11/2026)

Từ bản này, **chỉ máy chủ** được cộng/trừ số dư Xu trong Firestore. Trình duyệt (client) không ghi `balance` nữa.

Lý do: trước đây mỗi tab đang mở đều đẩy số dư trong máy nó lên cloud, nên khoản vừa cộng từ SePay bị tab khác ghi đè → số dư lúc đúng lúc sai, nhiều lúc phải duyệt tay.

Các đường ghi số dư hiện nay (đều là API máy chủ, ghi 1 lần, có chống trùng):
- Webhook SePay khi tiền vào: cộng Xu.
- Admin "Cộng Xu trực tiếp": cộng Xu (trước đây chỉ lưu tạm trong RAM nên mất khi server khởi động lại).
- Admin "Reset số dư": đặt về 0.
- Khách mua hàng: trừ Xu (bắt buộc đăng nhập đúng tài khoản, chống trừ trùng theo mã đơn).

Lưu ý khi vận hành:
- Tài khoản đăng nhập kiểu "local/mock" (không có Firebase ID Token thật) sẽ **không mua được** bằng Xu, vì máy chủ không xác thực được chủ ví. Hãy đăng nhập bằng email/Google thật.
- Nếu Firestore báo hết hạn mức miễn phí (`RESOURCE_EXHAUSTED`), mọi lệnh cộng/trừ đều thất bại và web sẽ báo lỗi rõ ràng. Kiểm tra bằng `https://www.promptmmo.store/api/sepay?probe=1`. Cách xử lý: bật gói Blaze cho project `promtmmo` (hạn mức miễn phí mỗi ngày vẫn giữ nguyên).
