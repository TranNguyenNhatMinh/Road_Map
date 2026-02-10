<?php
/**
 * Debug endpoint - Kiểm tra tất cả các vấn đề có thể xảy ra
 * Truy cập: https://yourdomain.com/api/debug.php
 */

// Tắt tất cả output buffering
while (ob_get_level()) {
    ob_end_clean();
}

// Set JSON header ngay từ đầu
header('Content-Type: application/json; charset=utf-8');

$debug = [
    'ok' => true,
    'checks' => []
];

// Check 1: PHP version
$debug['checks']['php_version'] = phpversion();

// Check 2: Required extensions
$required_extensions = ['pdo', 'pdo_mysql', 'json', 'session'];
$debug['checks']['extensions'] = [];
foreach ($required_extensions as $ext) {
    $debug['checks']['extensions'][$ext] = extension_loaded($ext);
}

// Check 3: File exists
$files_to_check = [
    'config.php',
    'db.php',
    'auth.php',
    'register.php',
    'login.php'
];
$debug['checks']['files'] = [];
foreach ($files_to_check as $file) {
    $path = __DIR__ . '/' . $file;
    $debug['checks']['files'][$file] = [
        'exists' => file_exists($path),
        'readable' => is_readable($path)
    ];
}

// Check 4: Try to load config
try {
    require_once __DIR__ . '/config.php';
    $debug['checks']['config_loaded'] = true;
    $debug['checks']['db_config'] = [
        'host' => DB_HOST,
        'name' => DB_NAME,
        'user' => DB_USER,
        'charset' => DB_CHARSET
    ];
} catch (Exception $e) {
    $debug['checks']['config_loaded'] = false;
    $debug['checks']['config_error'] = $e->getMessage();
}

// Check 5: Try database connection
if (isset($debug['checks']['config_loaded']) && $debug['checks']['config_loaded']) {
    try {
        require_once __DIR__ . '/db.php';
        $debug['checks']['database_connected'] = true;
        
        // Test query
        $test = $pdo->query("SELECT 1");
        $debug['checks']['database_query'] = true;
    } catch (Exception $e) {
        $debug['checks']['database_connected'] = false;
        $debug['checks']['database_error'] = $e->getMessage();
    }
}

// Check 6: Session
try {
    session_start();
    $debug['checks']['session_works'] = true;
    session_destroy();
} catch (Exception $e) {
    $debug['checks']['session_works'] = false;
    $debug['checks']['session_error'] = $e->getMessage();
}

// Check 7: Headers
$debug['checks']['headers'] = [
    'content_type_set' => headers_sent() ? false : true,
    'current_content_type' => headers_list()
];

echo json_encode($debug, JSON_PRETTY_PRINT);
