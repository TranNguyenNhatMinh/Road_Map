<?php
/**
 * User vocabulary API (English feature)
 * GET: list vocabulary for current user
 * POST: add or replace vocabulary (body: { "items": [ { "id", "english", "vietnamese" }, ... ] })
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

session_start_safe();
$userId = require_login();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare('SELECT id, english, vietnamese, created_at FROM user_vocabulary WHERE user_id = ? ORDER BY id ASC');
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll();
    $items = [];
    foreach ($rows as $r) {
        $items[] = [
            'id' => (string) $r['id'],
            'english' => $r['english'],
            'vietnamese' => $r['vietnamese']
        ];
    }
    echo json_encode(['ok' => true, 'items' => $items]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $items = $input['items'] ?? [];
    if (!is_array($items)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'items must be an array']);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('DELETE FROM user_vocabulary WHERE user_id = ?');
        $stmt->execute([$userId]);
        $stmt = $pdo->prepare('INSERT INTO user_vocabulary (user_id, english, vietnamese) VALUES (?, ?, ?)');
        foreach ($items as $item) {
            $english = isset($item['english']) ? trim($item['english']) : '';
            $vietnamese = isset($item['vietnamese']) ? trim($item['vietnamese']) : '';
            if ($english === '' || $vietnamese === '') continue;
            $stmt->execute([$userId, $english, $vietnamese]);
        }
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Save failed']);
        exit;
    }

    $stmt = $pdo->prepare('SELECT id, english, vietnamese FROM user_vocabulary WHERE user_id = ? ORDER BY id ASC');
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll();
    $out = [];
    foreach ($rows as $r) {
        $out[] = ['id' => (string) $r['id'], 'english' => $r['english'], 'vietnamese' => $r['vietnamese']];
    }
    echo json_encode(['ok' => true, 'items' => $out]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $id = isset($input['id']) ? (int) $input['id'] : 0;
    if ($id < 1) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'id required']);
        exit;
    }
    $stmt = $pdo->prepare('DELETE FROM user_vocabulary WHERE id = ? AND user_id = ?');
    $stmt->execute([$id, $userId]);
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
