# Backend API (PHP)

API dùng cho đăng ký, đăng nhập và lưu dữ liệu người dùng (từ vựng, từ đã học).

## Yêu cầu

- PHP 7.4+ (có extension `pdo_mysql`, `json`, `session`)
- MySQL hoặc MariaDB

## Cài đặt database

1. Tạo database và bảng bằng file SQL:

```bash
mysql -u root -p < database/schema.sql
```

Hoặc mở MySQL client (phpMyAdmin, MySQL Workbench…) và chạy nội dung file `database/schema.sql`.

2. Sửa thông tin kết nối trong `api/config.php`:

- `DB_HOST`: host MySQL (mặc định `localhost`)
- `DB_NAME`: tên database (mặc định `roadmap_db`)
- `DB_USER`, `DB_PASS`: user và mật khẩu MySQL

## Chạy backend

Cần chạy site qua web server có PHP (Apache/Nginx + PHP hoặc PHP built-in server).

Ví dụ dùng PHP built-in server (từ thư mục gốc project):

```bash
php -S localhost:8000
```

Sau đó mở trình duyệt: `http://localhost:8000` (trang HTML phải gọi API cùng origin thì session/cookie mới hoạt động).

## Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|--------|
| POST | `/api/register.php` | Đăng ký (body: `email`, `password`, `display_name` tùy chọn) |
| POST | `/api/login.php` | Đăng nhập (body: `email`, `password`) |
| POST | `/api/logout.php` | Đăng xuất |
| GET | `/api/me.php` | Lấy thông tin user hiện tại (nếu đã đăng nhập) |
| GET | `/api/vocabulary.php` | Danh sách từ vựng của user (cần đăng nhập) |
| POST | `/api/vocabulary.php` | Lưu/cập nhật từ vựng (body: `items`: array) |
| DELETE | `/api/vocabulary.php` | Xóa một từ (body: `id`) |
| GET | `/api/learned.php` | Danh sách id từ đã đánh dấu learned (cần đăng nhập) |
| POST | `/api/learned.php` | Cập nhật danh sách learned (body: `learned_ids`: array) |
| GET | `/api/progress.php` | Lấy tiến độ roadmap (CFA, Java, Aptech, Frontend) theo user (cần đăng nhập) |
| POST | `/api/progress.php` | Lưu tiến độ một roadmap (body: `roadmap_key`, `completed_ids`: array) |

Tất cả response dạng JSON. Session dùng cookie (same-site).
