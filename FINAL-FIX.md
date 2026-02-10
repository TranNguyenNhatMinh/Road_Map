# Giải pháp cuối cùng cho lỗi 405 Not Allowed

## Vấn đề:
Server trả về **405 Not Allowed** khi gửi POST request đến `api/login.php` hoặc `api/register.php`.

## Nguyên nhân có thể:
1. **Server đang block POST method** ở cấp cao (firewall, ModSecurity)
2. **.htaccess không được load** hoặc có lỗi
3. **Server không hỗ trợ POST** cho thư mục `api/`
4. **CORS preflight** đang bị block

## Giải pháp từng bước:

### Bước 1: Kiểm tra server
Truy cập: `https://yourdomain.com/api/check-server.php`

Xem kết quả:
- `htaccess.exists` = true/false?
- `methods.post_available` = true/false?
- `apache_modules` có gì?

### Bước 2: Test POST trực tiếp
Mở **Browser Console** (F12) → Tab **Console**, chạy:

```javascript
// Test 1: Simple POST
fetch('https://yourdomain.com/api/check-server.php', {
  method: 'POST',
  body: 'test=1'
})
.then(r => r.text())
.then(text => {
  console.log('POST Response:', text.substring(0, 200));
  try {
    console.log('JSON:', JSON.parse(text));
  } catch(e) {
    console.error('Not JSON');
  }
})
.catch(e => console.error('Fetch Error:', e));
```

**Nếu vẫn 405** → Server đang block POST

### Bước 3: Thử không dùng JSON
Có thể server block `Content-Type: application/json`. Thử sửa tạm `auth.js`:

```javascript
// Thay vì:
opts.headers = { 'Content-Type': 'application/json' };

// Thử:
opts.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
opts.body = 'email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password);
```

### Bước 4: Kiểm tra CORS Preflight
Lỗi 405 có thể do OPTIONS request bị block. Kiểm tra:

```javascript
fetch('https://yourdomain.com/api/login.php', {
  method: 'OPTIONS'
})
.then(r => console.log('OPTIONS Status:', r.status))
.catch(e => console.error('OPTIONS Error:', e));
```

### Bước 5: Liên hệ Hosting (QUAN TRỌNG)

Nếu tất cả đều không được, **PHẢI** liên hệ hosting và cung cấp:

1. **Lỗi cụ thể**: "405 Not Allowed khi POST đến api/login.php"
2. **Đã thử**: Xóa .htaccess, test POST method
3. **Yêu cầu**: 
   - Cho phép POST method trong thư mục `api/`
   - Kiểm tra ModSecurity có đang block POST không
   - Kiểm tra firewall rules
   - Cho phép CORS preflight (OPTIONS request)

## Giải pháp tạm thời (nếu cần):

Nếu không thể fix ngay, có thể dùng **GET với query parameters** (KHÔNG AN TOÀN, chỉ để test):

```php
// Trong login.php - THÊM TẠM để test
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['test'])) {
    $input = $_GET;
    // ... rest of code
}
```

**NHƯNG** cách này không an toàn vì password sẽ hiện trong URL.

## Checklist cuối cùng:

- [ ] Đã upload file `.htaccess` mới (minimal version)
- [ ] Đã test xóa `.htaccess` và POST vẫn không hoạt động
- [ ] Đã test `api/check-server.php` với POST
- [ ] Đã kiểm tra Console có lỗi CORS không
- [ ] Đã liên hệ hosting về vấn đề này

## Kết luận:

Nếu đã thử tất cả và vẫn 405 → **Server đang block POST ở cấp cao**. Cần liên hệ hosting để:
1. Cho phép POST trong thư mục `api/`
2. Tắt ModSecurity rules đang chặn POST
3. Cấu hình firewall để cho phép POST

**Đây KHÔNG phải lỗi code**, mà là vấn đề **server configuration**.
