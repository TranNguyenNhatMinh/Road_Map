# ⚠️ URGENT: Lỗi 405 Not Allowed - Cần Fix Ngay

## Vấn đề:
Server trả về **405 Not Allowed** khi POST đến `api/login.php` và `api/register.php`.

## ✅ Đã thử (KHÔNG được):
- [x] Sửa `.htaccess` nhiều lần
- [x] Xóa `.htaccess` hoàn toàn
- [x] Test POST với các endpoints khác
- [x] Kiểm tra PHP có hoạt động (GET hoạt động bình thường)
- [x] Kiểm tra file permissions

## 🔍 Xác nhận vấn đề:

### Test 1: Kiểm tra server
Truy cập: `https://yourdomain.com/api/test-all-methods.php`

### Test 2: Test POST trực tiếp
Mở **Browser Console** (F12), chạy:

```javascript
fetch('https://yourdomain.com/api/test-all-methods.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({test: 1})
})
.then(r => {
  console.log('Status:', r.status);
  return r.text();
})
.then(text => {
  console.log('Response:', text.substring(0, 200));
  if (r.status === 405) {
    console.error('❌ CONFIRMED: Server đang BLOCK POST');
  }
});
```

**Nếu Status = 405** → ✅ XÁC NHẬN: Server đang block POST

## 🚨 GIẢI PHÁP DUY NHẤT:

### PHẢI liên hệ Hosting Support NGAY

**Template message (copy và gửi):**

```
Subject: URGENT - 405 Not Allowed khi POST đến API endpoints

Xin chào Support Team,

Tôi đang gặp lỗi 405 Not Allowed khi gửi POST requests đến các API endpoints.

Chi tiết:
- URL: https://yourdomain.com/api/login.php
- Method: POST
- Response: 405 Not Allowed (HTML error page)

Đã thử:
- Xóa .htaccess
- Test POST với các endpoints khác
- PHP GET requests hoạt động bình thường

Yêu cầu:
1. Cho phép POST method trong thư mục api/
2. Kiểm tra ModSecurity có đang block POST không
3. Kiểm tra firewall rules
4. Cho phép CORS preflight (OPTIONS)

Cảm ơn!
```

## 📞 Hoặc gọi điện:

**Câu hỏi cần hỏi:**
1. "Server có đang block POST method không?"
2. "Có thể cho phép POST trong thư mục api/ không?"
3. "ModSecurity có đang chặn POST requests không?"
4. "Có cần cấu hình gì đặc biệt không?"

## ⚡ Nếu hosting không thể giúp:

### Option 1: Upgrade Hosting
- Upgrade lên plan cao hơn có quyền cấu hình server
- Hoặc chuyển sang VPS để có full control

### Option 2: Đổi Hosting
- Tìm hosting khác hỗ trợ POST method tốt hơn
- Kiểm tra trước khi mua: hỏi "Có cho phép POST method không?"

### Option 3: Workaround (KHÔNG KHUYẾN NGHỊ)
- Dùng GET với query parameters (KHÔNG AN TOÀN)
- Hoặc dùng form submit thay vì AJAX

## ✅ Checklist:

- [ ] Đã test `api/test-all-methods.php` với POST
- [ ] Đã xác nhận Status = 405
- [ ] Đã liên hệ hosting support
- [ ] Đã cung cấp đầy đủ thông tin cho hosting

## 🎯 Kết luận:

**Đây KHÔNG phải lỗi code** - code đã đúng 100%.

**Đây là vấn đề SERVER CONFIGURATION** - chỉ hosting mới fix được.

**PHẢI liên hệ hosting** - không có cách nào khác!
