# Hướng dẫn Debug lỗi "Unexpected token '<', "<html>..." is not valid JSON"

## Bước 1: Kiểm tra PHP có chạy không

Truy cập trực tiếp trong browser:
```
https://yourdomain.com/api/test.php
```

**Kết quả mong đợi:** Phải thấy JSON như này:
```json
{
  "ok": true,
  "message": "PHP is working!",
  "php_version": "7.4.x",
  ...
}
```

**Nếu thấy HTML hoặc lỗi:**
- Server chưa cấu hình PHP đúng
- Cần liên hệ hosting để cấu hình PHP

## Bước 2: Kiểm tra API login trực tiếp

Mở **Browser Console** (F12) → Tab **Network** → Thử đăng nhập lại

Xem request đến `api/login.php`:
- **Status Code:** Phải là 200, 400, 401, 500 (không phải 404)
- **Response:** Phải là JSON, không phải HTML

**Nếu Status Code là 404:**
- Đường dẫn API không đúng
- Kiểm tra URL trong Network tab xem đúng chưa

**Nếu Response là HTML:**
- PHP không chạy được file đó
- Có thể có lỗi PHP syntax
- Kiểm tra file `api/login.php` có tồn tại không

## Bước 3: Kiểm tra Database Connection

Sửa tạm file `api/login.php` để test database (sau đó xóa đoạn này):

Thêm vào đầu file (sau `require_once`):
```php
try {
    $test = $pdo->query("SELECT 1");
    error_log("Database OK");
} catch (Exception $e) {
    error_log("Database Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Database: ' . $e->getMessage()]);
    exit;
}
```

## Bước 4: Kiểm tra file config.php

Đảm bảo `api/config.php` có:
```php
header('Content-Type: application/json; charset=utf-8');
```

Ở **đầu file**, trước mọi code khác.

## Bước 5: Kiểm tra .htaccess

File `api/.htaccess` phải có nội dung:
```apache
AddHandler application/x-httpd-php .php
AddDefaultCharset UTF-8
```

Nếu server không hỗ trợ `.htaccess`, cần cấu hình trong `httpd.conf` hoặc `apache2.conf`.

## Bước 6: Kiểm tra Error Logs

Xem error log của server:
- Apache: `/var/log/apache2/error.log` hoặc `/var/log/httpd/error_log`
- Nginx: `/var/log/nginx/error.log`
- Hoặc trong cPanel → Error Logs

Tìm các dòng có chứa `login.php` hoặc `api/` để xem lỗi cụ thể.

## Bước 7: Test với curl (nếu có SSH access)

```bash
curl -X POST https://yourdomain.com/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

Nếu trả về HTML → Server không chạy PHP
Nếu trả về JSON → PHP đã chạy, có thể là vấn đề frontend

## Giải pháp nhanh

Nếu vẫn không được, thử:

1. **Tạo file `api/index.php`** để test:
```php
<?php
header('Content-Type: application/json');
echo json_encode(['test' => 'ok']);
?>
```

2. **Kiểm tra PHP version:**
Tạo `api/phpinfo.php`:
```php
<?php phpinfo(); ?>
```
Truy cập và xem PHP có hoạt động không.

3. **Liên hệ hosting:**
- Hỏi họ có hỗ trợ PHP không
- Hỏi PHP version là gì
- Hỏi đường dẫn database host là gì (có thể không phải `localhost`)

## Checklist trước khi deploy

- [ ] PHP 7.4+ đã được cài đặt
- [ ] Extension `pdo_mysql` đã được enable
- [ ] Database đã được tạo từ `database/schema.sql`
- [ ] File `api/config.php` đã được sửa với thông tin database đúng
- [ ] File `.htaccess` trong thư mục `api/` đã được upload
- [ ] Test `api/test.php` trả về JSON
- [ ] Test `api/login.php` với POST request trả về JSON
