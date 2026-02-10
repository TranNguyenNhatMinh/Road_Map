<?php
/**
 * Router endpoint - thử cách khác nếu POST bị block
 * Có thể dùng: POST /api/router.php?action=login
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

$action = $_GET['action'] ?? $_POST['action'] ?? '';

if ($action === 'login') {
    try {
        session_start_safe();
        
        // Lấy data từ POST hoặc JSON
        $email = $_POST['email'] ?? '';
        $password = $_POST['password'] ?? '';
        
        if (empty($email) || empty($password)) {
            $input = json_decode(file_get_contents('php://input'), true) ?: [];
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
        }
        
        if (empty($email) || empty($password)) {
            jsonError('Email and password are required', 400);
        }
        
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
    } catch (Exception $e) {
        jsonError('Login failed: ' . $e->getMessage(), 500);
    }
} else {
    jsonError('Invalid action. Use ?action=login', 400);
}
