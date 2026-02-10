<?php
/**
 * Test POST method - Kiểm tra server có cho phép POST không
 * Truy cập: https://yourdomain.com/api/test-post.php
 */

header('Content-Type: application/json; charset=utf-8');

$result = [
    'ok' => true,
    'method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
    'allowed_methods' => [],
    'post_data' => [],
    'server_info' => []
];

// Kiểm tra method
$result['method'] = $_SERVER['REQUEST_METHOD'];

// Kiểm tra POST data
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $result['post_data'] = [
        'raw_input' => file_get_contents('php://input'),
        'post_array' => $_POST,
        'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'Not set'
    ];
} else {
    $result['message'] = 'This endpoint accepts POST. Send a POST request to test.';
}

// Server info
$result['server_info'] = [
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'php_version' => phpversion(),
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'Unknown'
];

echo json_encode($result, JSON_PRETTY_PRINT);
