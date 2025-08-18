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

if (!$id) {
    http_response_code(400);
    echo json_encode(["message" => "Event ID is required."]);
    exit;
}

// Combine date and time if provided
$event_datetime = null;
if (!empty($data->eventDate) && !empty($data->eventTimeHours) && !empty($data->eventTimeMinutes)) {
    $timeString = "{$data->eventTimeHours}:{$data->eventTimeMinutes}:00 {$data->eventTimePeriod}";
    $formattedTime = date("H:i:s", strtotime($timeString));
    $event_datetime = "{$data->eventDate} {$formattedTime}";
}

// Build the query dynamically
$query_parts = [];
$params = [];

if (!empty($data->eventTitle)) { $query_parts[] = "event_title = :title"; $params[':title'] = $data->eventTitle; }
if (!empty($data->description)) { $query_parts[] = "description = :description"; $params[':description'] = $data->description; }
if ($event_datetime !== null) { $query_parts[] = "event_datetime = :datetime"; $params[':datetime'] = $event_datetime; }
if (!empty($data->location)) { $query_parts[] = "location = :location"; $params[':location'] = $data->location; }
if (!empty($data->durationHours)) { $query_parts[] = "duration_hours = :duration"; $params[':duration'] = $data->durationHours; }

if (empty($query_parts)) {
    http_response_code(400);
    echo json_encode(["message" => "No data provided for update."]);
    exit;
}

$params[':id'] = $id;
$query = "UPDATE events SET " . implode(', ', $query_parts) . " WHERE id = :id";

try {
    $stmt = $pdo->prepare($query);
    if ($stmt->execute($params)) {
        http_response_code(200);
        echo json_encode(["message" => "Event was updated."]);
    } else {
        throw new Exception("Update failed.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update event.", "error" => $e->getMessage()]);
}
?>
