<?php // backend/api/results/delete.php
header("Access-Control-Allow-Origin: *");
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
// ... baaki headers ...

include_once '../../config/database.php';
$data = json_decode(file_get_contents("php://input"));

if (empty($data->id)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Result ID is required."]);
    exit;
}

try {
    $stmt = $pdo->prepare("DELETE FROM results WHERE id = ?");
    $stmt->execute([$data->id]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Result deleted."]);
    } else {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Result not found."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to delete result."]);
}
?>
