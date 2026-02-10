<?php
/**
 * Learned words (flashcard) — sync which vocabulary IDs are marked learned
 * GET: list of vocabulary ids that are learned
 * POST: set learned list (body: { "learned_ids": [ "1", "2", ... ] }) — vocabulary ids from user_vocabulary
 */

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/auth.php';

session_start_safe();
$userId = require_login();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare(
        'SELECT vocabulary_id FROM user_learned_words WHERE user_id = ?'
    );
    $stmt->execute([$userId]);
    $ids = array_map(function ($r) { return (string) $r['vocabulary_id']; }, $stmt->fetchAll());
    echo json_encode(['ok' => true, 'learned_ids' => $ids]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $learnedIds = $input['learned_ids'] ?? [];
    if (!is_array($learnedIds)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => 'learned_ids must be an array']);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $stmtDel = $pdo->prepare('DELETE FROM user_learned_words WHERE user_id = ?');
        $stmtDel->execute([$userId]);
        $stmtIns = $pdo->prepare('INSERT IGNORE INTO user_learned_words (user_id, vocabulary_id) VALUES (?, ?)');
        foreach ($learnedIds as $vid) {
            $vid = (int) $vid;
            if ($vid > 0) {
                $stmtCheck = $pdo->prepare('SELECT id FROM user_vocabulary WHERE id = ? AND user_id = ?');
                $stmtCheck->execute([$vid, $userId]);
                if ($stmtCheck->fetch()) {
                    $stmtIns->execute([$userId, $vid]);
                }
            }
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
