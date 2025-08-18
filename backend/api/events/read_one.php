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

$id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT) : null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["message" => "Event ID is missing or invalid."]);
    exit;
}

try {
    $query = "SELECT id, event_title, description, event_datetime, location, duration_hours FROM events WHERE id = :id LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if($row) {
        http_response_code(200);
        echo json_encode($row);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Event not found."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to fetch event.", "error" => $e->getMessage()]);
}
?>
