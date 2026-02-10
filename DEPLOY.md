# Hướng dẫn Deploy Roadmap App

## Yêu cầu Server

1. **PHP 7.4+** với các extension:
   - `pdo_mysql`
   - `json`
   - `session`

2. **MySQL/MariaDB** database

3. **Web server** hỗ trợ PHP (Apache/Nginx)

## Các bước Deploy

### 1. Upload files lên server
- Upload toàn bộ thư mục project lên server
- Đảm bảo thư mục `api/` có quyền đọc/ghi

### 2. Cấu hình Database

Sửa file `api/config.php`:
```php
define('DB_HOST', 'localhost'); // hoặc IP database server
define('DB_NAME', 'roadmap_db'); // tên database của bạn
define('DB_USER', 'your_db_user'); // user database
define('DB_PASS', 'your_db_password'); // password database
```

### 3. Tạo Database

Chạy file SQL trong `database/schema.sql` để tạo database và tables:
```bash
mysql -u your_db_user -p your_database < database/schema.sql
```

Hoặc import qua phpMyAdmin.

### 4. Kiểm tra API

Truy cập trực tiếp API endpoint để kiểm tra:
- `https://yourdomain.com/api/me.php` → Phải trả về JSON, không phải HTML
- Nếu trả về HTML → Server chưa cấu hình PHP đúng

### 5. Cấu hình Apache (.htaccess)

File `.htaccess` trong thư mục `api/` đã được tạo tự động. Nếu server không hỗ trợ `.htaccess`, cần cấu hình trong `httpd.conf` hoặc `apache2.conf`:

```apache
<Directory "/path/to/api">
    AllowOverride All
    Options -Indexes
</Directory>
```

### 6. Cấu hình Nginx

Nếu dùng Nginx, thêm vào config:

```nginx
location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
    fastcgi_index index.php;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
}
```

## Kiểm tra lỗi thường gặp

### Lỗi: "Unexpected token '<', "<html>..." is not valid JSON"

**Nguyên nhân:**
- Server không chạy PHP hoặc cấu hình sai
- API endpoint trả về HTML thay vì JSON
- Đường dẫn API không đúng

**Cách sửa:**
1. Kiểm tra PHP có hoạt động: Tạo file `test.php` với nội dung `<?php phpinfo(); ?>` và truy cập
2. Kiểm tra đường dẫn API trong browser console (F12 → Network tab)
3. Kiểm tra file `.htaccess` trong thư mục `api/` có được load không
4. Kiểm tra database connection trong `api/config.php`

### Lỗi: "Database connection failed"

**Nguyên nhân:**
- Thông tin database trong `api/config.php` sai
- Database chưa được tạo
- User database không có quyền truy cập

**Cách sửa:**
1. Kiểm tra lại thông tin database trong `api/config.php`
2. Đảm bảo database đã được tạo từ `database/schema.sql`
3. Kiểm tra user database có quyền SELECT, INSERT, UPDATE, DELETE

### Lỗi: CORS

**Nguyên nhân:**
- Frontend và API không cùng domain/port

**Cách sửa:**
- File `api/config.php` đã có CORS headers, nhưng nếu vẫn lỗi, có thể cần sửa:
```php
header('Access-Control-Allow-Origin: https://yourdomain.com');
```

## Test sau khi deploy

1. Mở trang chủ → Kiểm tra không có lỗi console
2. Thử đăng ký tài khoản mới
3. Thử đăng nhập
4. Kiểm tra tiến độ học có được lưu không

## Lưu ý bảo mật

1. **Không commit** file `api/config.php` có thông tin database thật vào Git
2. Đặt `api/config.php` vào `.gitignore` nếu cần
3. Đảm bảo thư mục `api/` không cho phép directory listing
4. Sử dụng HTTPS trong production
