# Template Email/Message cho Hosting Support

## Subject:
405 Not Allowed khi POST đến API endpoints

## Nội dung:

Xin chào,

Tôi đang gặp lỗi **405 Not Allowed** khi gửi POST requests đến các API endpoints trong thư mục `api/` của website.

### Chi tiết lỗi:
- **URL**: `https://yourdomain.com/api/login.php` và `https://yourdomain.com/api/register.php`
- **Method**: POST
- **Content-Type**: application/json
- **Response**: 405 Not Allowed với HTML error page

### Đã thử:
1. ✅ Xóa file `.htaccess` trong thư mục `api/`
2. ✅ Test POST method với các endpoints khác
3. ✅ Kiểm tra PHP có hoạt động (GET requests hoạt động bình thường)
4. ✅ Kiểm tra file permissions

### Yêu cầu:
Có thể bạn giúp tôi:

1. **Cho phép POST method** trong thư mục `api/` hoặc toàn bộ website
2. **Kiểm tra ModSecurity** có đang block POST requests không
3. **Kiểm tra firewall rules** có đang chặn POST không
4. **Cho phép CORS preflight** (OPTIONS requests) nếu cần
5. **Kiểm tra Apache/Nginx configuration** có đang restrict POST không

### Thông tin server:
- PHP Version: [điền version]
- Server Software: [Apache/Nginx]
- Control Panel: [cPanel/Plesk/etc]

Cảm ơn bạn đã hỗ trợ!

---

## Hoặc gọi điện/chat:

**Câu hỏi cần hỏi:**
1. "Server có đang block POST method không?"
2. "Có thể cho phép POST trong thư mục api/ không?"
3. "ModSecurity có đang chặn POST requests không?"
4. "Có cần cấu hình gì đặc biệt để cho phép POST không?"

## Nếu hosting không thể giúp:

Có thể cần:
1. **Upgrade hosting plan** để có quyền cấu hình server
2. **Chuyển sang VPS** để có full control
3. **Dùng hosting khác** hỗ trợ POST method tốt hơn
