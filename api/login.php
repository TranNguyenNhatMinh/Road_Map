<?php
/**
 * POST: Login
 * Body: { "email": "...", "password": "..." }
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

session_start_safe();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$email = isset($input['email']) ? trim($input['email']) : '';
$password = $input['password'] ?? '';

if ($email === '' || $password === '') {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Email and password are required']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, email, password_hash, display_name FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password_hash'])) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => 'Invalid email or password']);
    exit;
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
