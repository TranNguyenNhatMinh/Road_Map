<?php
/**
 * Test tất cả HTTP methods để xem method nào được phép
 * Truy cập: https://yourdomain.com/api/test-all-methods.php
 */

header('Content-Type: application/json; charset=utf-8');

$result = [
    'ok' => true,
    'current_method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
    'server_allows' => [],
    'test_results' => []
];

// Test các methods
$methods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'];

foreach ($methods as $method) {
    $result['test_results'][$method] = [
        'current_request_is' => $_SERVER['REQUEST_METHOD'] === $method,
        'note' => 'Send ' . $method . ' request to see if allowed'
    ];
}

// Nếu là POST, hiển thị thông tin
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result['post_works'] = true;
    $result['post_data'] = [
        'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'Not set',
        'content_length' => $_SERVER['CONTENT_LENGTH'] ?? '0',
        'has_post_array' => !empty($_POST),
        'raw_input' => substr(file_get_contents('php://input'), 0, 100)
    ];
}

$result['server_info'] = [
    'software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'php_version' => phpversion(),
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown'
];

echo json_encode($result, JSON_PRETTY_PRINT);
