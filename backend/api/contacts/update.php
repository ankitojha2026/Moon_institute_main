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

$data = json_decode(file_get_contents("php://input"));
$id = isset($data->id) ? filter_var($data->id, FILTER_VALIDATE_INT) : null;
$status = $data->status ?? null;

if (!$id || !$status) {
    http_response_code(400);
    echo json_encode(["message" => "Contact ID and status are required."]);
    exit;
}

// Validate status
$allowed_statuses = ['new', 'contacted', 'enrolled', 'rejected'];
if (!in_array($status, $allowed_statuses)) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid status value."]);
    exit;
}

$query = "UPDATE contacts SET status = :status WHERE id = :id";

try {
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':status', $status);
    $stmt->bindParam(':id', $id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["message" => "Status updated successfully."]);
    } else {
        throw new Exception("Update failed.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update status.", "error" => $e->getMessage()]);
}
?>
