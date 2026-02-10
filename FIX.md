# Hướng dẫn Fix lỗi "Unexpected token '<', '<html>..." 

## Bước 1: Kiểm tra Debug

Truy cập trong browser:
```
https://yourdomain.com/api/debug.php
```

**Nếu thấy JSON** → Copy toàn bộ JSON và xem phần `checks` để biết vấn đề ở đâu.

**Nếu thấy HTML/lỗi** → Server không chạy PHP. Cần liên hệ hosting.

## Bước 2: Kiểm tra từng phần

### Nếu `config_loaded = false`:
- File `api/config.php` có lỗi syntax
- Sửa lại file `api/config.php` với thông tin database đúng

### Nếu `database_connected = false`:
- Thông tin database trong `api/config.php` sai
- Database chưa được tạo
- Sửa `api/config.php`:
```php
define('DB_HOST', 'localhost'); // hoặc IP database server
define('DB_NAME', 'roadmap_db'); // tên database của bạn
define('DB_USER', 'your_db_user');
define('DB_PASS', 'your_db_password');
```

### Nếu `files` có file nào `exists = false`:
- File đó chưa được upload lên server
- Upload lại file đó

## Bước 3: Test API trực tiếp

### Test Register API:
Mở **Browser Console** (F12) → Tab **Console**, chạy:

```javascript
fetch('https://yourdomain.com/api/register.php', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  credentials: 'include',
  body: JSON.stringify({
    email: 'test@test.com',
    password: 'test123',
    display_name: 'Test User'
  })
})
.then(r => r.text())
.then(text => {
  console.log('Response:', text);
  try {
    console.log('JSON:', JSON.parse(text));
  } catch(e) {
    console.error('Not JSON:', text.substring(0, 200));
  }
});
```

**Nếu response là HTML** → Copy 100 ký tự đầu và xem lỗi gì.

## Bước 4: Kiểm tra Server Logs

Xem error log của server:
- **cPanel**: Error Logs trong File Manager
- **Apache**: `/var/log/apache2/error.log`
- **Nginx**: `/var/log/nginx/error.log`

Tìm các dòng có chứa `register.php` hoặc `api/` để xem lỗi cụ thể.

## Bước 5: Kiểm tra .htaccess

Đảm bảo file `api/.htaccess` có nội dung:
```apache
AddHandler application/x-httpd-php .php
AddDefaultCharset UTF-8
```

Nếu server không hỗ trợ `.htaccess`, cần cấu hình trong `httpd.conf`.

## Giải pháp nhanh nhất

1. **Kiểm tra PHP có chạy không:**
   - Tạo file `test.php` với nội dung: `<?php phpinfo(); ?>`
   - Truy cập `https://yourdomain.com/test.php`
   - Nếu thấy thông tin PHP → PHP đã chạy
   - Nếu thấy lỗi → PHP chưa được cấu hình

2. **Kiểm tra Database:**
   - Đăng nhập phpMyAdmin hoặc MySQL client
   - Tạo database `roadmap_db` nếu chưa có
   - Import file `database/schema.sql`
   - Sửa `api/config.php` với thông tin database đúng

3. **Kiểm tra File Permissions:**
   - Đảm bảo tất cả file trong `api/` có quyền đọc (644)
   - Thư mục `api/` có quyền đọc (755)

## Nếu vẫn không được

Liên hệ hosting và hỏi:
1. PHP version là gì? (cần 7.4+)
2. Extension `pdo_mysql` có được enable không?
3. Database host là gì? (có thể không phải `localhost`)
4. Có hỗ trợ `.htaccess` không?
