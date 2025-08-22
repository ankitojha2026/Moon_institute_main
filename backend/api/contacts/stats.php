<?php
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// The browser sends an 'OPTIONS' method request first to check CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Just send back a 200 OK response for OPTIONS request
    http_response_code(200);
    exit();
}
include_once '../../config/database.php';

try {
    // Query to get counts for each status
    $query = "
        SELECT
            COUNT(*) as total,
            SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) as new_count,
            SUM(CASE WHEN status = 'contacted' THEN 1 ELSE 0 END) as contacted_count,
            SUM(CASE WHEN status = 'enrolled' THEN 1 ELSE 0 END) as enrolled_count,
            SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected_count
        FROM
            contacts
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $stats = $stmt->fetch(PDO::FETCH_ASSOC);

    // Prepare the final array with correct keys for the frontend
    $response_stats = [
        'total' => (int)$stats['total'],
        'new' => (int)$stats['new_count'],
        'contacted' => (int)$stats['contacted_count'],
        'enrolled' => (int)$stats['enrolled_count'],
        'rejected' => (int)$stats['rejected_count']
    ];

    http_response_code(200);
    echo json_encode($response_stats);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to fetch stats.", "error" => $e->getMessage()]);
}
?>
