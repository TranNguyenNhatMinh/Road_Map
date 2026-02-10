<?php
/**
 * Kiểm tra server configuration và POST method
 * Truy cập: https://yourdomain.com/api/check-server.php
 */

header('Content-Type: application/json; charset=utf-8');

$info = [
    'ok' => true,
    'server' => [],
    'php' => [],
    'methods' => [],
    'htaccess' => []
];

// Server info
$info['server'] = [
    'software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'method' => $_SERVER['REQUEST_METHOD'] ?? 'Unknown',
    'protocol' => $_SERVER['SERVER_PROTOCOL'] ?? 'Unknown',
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'Unknown'
];

// PHP info
$info['php'] = [
    'version' => phpversion(),
    'sapi' => php_sapi_name(),
    'extensions' => [
        'pdo' => extension_loaded('pdo'),
        'pdo_mysql' => extension_loaded('pdo_mysql'),
        'json' => extension_loaded('json'),
        'session' => extension_loaded('session')
    ]
];

// Method check
$info['methods'] = [
    'current_method' => $_SERVER['REQUEST_METHOD'],
    'post_available' => isset($_POST) || !empty(file_get_contents('php://input')),
    'get_available' => isset($_GET)
];

// .htaccess check
$info['htaccess'] = [
    'exists' => file_exists('.htaccess'),
    'readable' => is_readable('.htaccess'),
    'content' => file_exists('.htaccess') ? file_get_contents('.htaccess') : 'Not found'
];

// Apache modules (if available)
if (function_exists('apache_get_modules')) {
    $info['apache_modules'] = apache_get_modules();
}

echo json_encode($info, JSON_PRETTY_PRINT);
