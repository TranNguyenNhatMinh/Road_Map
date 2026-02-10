<?php
/**
 * Login endpoint - nhận form-data thay vì JSON
 * Test endpoint này để xem server có block JSON không
 */

header('Content-Type: application/json; charset=utf-8');

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

function jsonError($message, $code = 500) {
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message]);
    exit;
}

try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/db.php';
    require_once __DIR__ . '/auth.php';
} catch (Exception $e) {
    jsonError('Server configuration error: ' . $e->getMessage(), 500);
} catch (Error $e) {
    jsonError('Server error: ' . $e->getMessage(), 500);
}

try {
    session_start_safe();
} catch (Exception $e) {
    jsonError('Session error: ' . $e->getMessage(), 500);
}

// Chấp nhận cả POST form-data và JSON
$email = '';
$password = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Thử lấy từ form-data trước
    if (isset($_POST['email']) && isset($_POST['password'])) {
        $email = trim($_POST['email']);
        $password = $_POST['password'];
    } else {
        // Nếu không có form-data, thử JSON
        $input = json_decode(file_get_contents('php://input'), true) ?: [];
        $email = isset($input['email']) ? trim($input['email']) : '';
        $password = $input['password'] ?? '';
    }
} else {
    jsonError('Method not allowed. Use POST.', 405);
}

if ($email === '' || $password === '') {
    jsonError('Email and password are required', 400);
}

try {
    $stmt = $pdo->prepare('SELECT id, email, password_hash, display_name FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        jsonError('Invalid email or password', 401);
    }

    $_SESSION['user_id'] = (int) $user['id'];
    $_SESSION['user_email'] = $user['email'];

    echo json_encode([
        'ok' => true,
        'user' => [
            'id' => (int) $user['id'],
            'email' => $user['email'],
            'display_name' => $user['display_name']
        ]
    ]);
} catch (PDOException $e) {
    jsonError('Database error: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    jsonError('Login failed: ' . $e->getMessage(), 500);
} catch (Error $e) {
    jsonError('Server error: ' . $e->getMessage(), 500);
}
