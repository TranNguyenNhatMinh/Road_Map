<?php
/**
 * User roadmap progress — sync completed tasks per roadmap (CFA, Java, Aptech, Frontend).
 * GET: returns { "roadmap_key": ["id1", "id2", ...], ... } for current user
 * POST: body { "roadmap_key": "java-roadmap-tracker", "completed_ids": ["id1", "id2"] } — save completed items for that roadmap
 * Requires login.
 */

// Set JSON header first to prevent HTML output
header('Content-Type: application/json; charset=utf-8');

// Error handling wrapper
try {
    require_once __DIR__ . '/config.php';
    require_once __DIR__ . '/db.php';
    require_once __DIR__ . '/auth.php';
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'Server configuration error: ' . $e->getMessage()]);
    exit;
}

session_start_safe();
$userId = require_login();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare(
        'SELECT roadmap_key, item_id FROM user_progress WHERE user_id = ? AND completed = 1'
    );
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll();
    $byKey = [];
    foreach ($rows as $r) {
        $key = $r['roadmap_key'];
        if (!isset($byKey[$key])) {
            $byKey[$key] = [];
        }
        $byKey[$key][] = $r['item_id'];
    }
    echo json_encode(['ok' => true, 'progress' => $byKey]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $roadmapKey = isset($input['roadmap_key']) ? trim((string) $input['roadmap_key']) : '';
    $completedIds = $input['completed_ids'] ?? [];
    if ($roadmapKey === '' || strlen($roadmapKey) > 50) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'Invalid roadmap_key']);
        exit;
    }
    if (!is_array($completedIds)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'completed_ids must be an array']);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $stmtDel = $pdo->prepare('DELETE FROM user_progress WHERE user_id = ? AND roadmap_key = ?');
        $stmtDel->execute([$userId, $roadmapKey]);
        $stmtIns = $pdo->prepare(
            'INSERT INTO user_progress (user_id, roadmap_key, item_id, completed) VALUES (?, ?, ?, 1)'
        );
        $seen = [];
        foreach ($completedIds as $id) {
            $id = trim((string) $id);
            if ($id === '' || strlen($id) > 100 || isset($seen[$id])) {
                continue;
            }
            $seen[$id] = true;
            $stmtIns->execute([$userId, $roadmapKey, $id]);
        }
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
        http_response_code(500);
        echo json_encode(['ok' => false, 'error' => 'Save failed']);
        exit;
    }
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
