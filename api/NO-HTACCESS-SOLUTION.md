# Giải pháp khi .htaccess không hoạt động

## Nếu vẫn lỗi 405 sau khi sửa .htaccess:

### Giải pháp 1: Xóa hoàn toàn .htaccess

1. **Xóa file** `api/.htaccess`
2. **Test lại** login/register
3. Nếu POST hoạt động → Server không cần `.htaccess` để chạy PHP

### Giải pháp 2: Kiểm tra server có chặn POST không

Tạo file `api/check-method.php`:
```php
<?php
header('Content-Type: application/json');
echo json_encode([
    'method' => $_SERVER['REQUEST_METHOD'],
    'allows_post' => $_SERVER['REQUEST_METHOD'] === 'POST' ? 'YES' : 'Send POST to test'
]);
?>
```

Test với POST:
```javascript
fetch('https://yourdomain.com/api/check-method.php', {
  method: 'POST',
  body: JSON.stringify({test: 1})
}).then(r => r.json()).then(console.log);
```

### Giải pháp 3: Dùng GET thay vì POST (tạm thời)

**KHÔNG KHUYẾN NGHỊ** nhưng có thể test:
- Sửa `login.php` và `register.php` để chấp nhận cả GET và POST
- Chỉ để test xem server có block POST không

### Giải pháp 4: Liên hệ hosting

Nếu tất cả đều không được, **PHẢI** liên hệ hosting và hỏi:

1. **"Server có đang block POST method không?"**
2. **"Có thể cho phép POST trong thư mục api/ không?"**
3. **"Có ModSecurity hoặc firewall đang chặn POST không?"**
4. **"Có cần cấu hình gì đặc biệt để cho phép POST không?"**

### Giải pháp 5: Kiểm tra trong cPanel

Nếu dùng cPanel:
1. Vào **cPanel** → **File Manager**
2. Tìm file `.htaccess` trong `api/`
3. **Xóa file** và test
4. Nếu POST hoạt động → Tạo lại `.htaccess` đơn giản nhất:
   ```
   AddHandler application/x-httpd-php .php
   ```

## Test nhanh nhất:

1. **Xóa file** `api/.htaccess`
2. **Test login/register** lại
3. **Nếu hoạt động** → Upload lại file `.htaccess.minimal` và đổi tên thành `.htaccess`
4. **Nếu vẫn 405** → Server đang block POST, cần liên hệ hosting
