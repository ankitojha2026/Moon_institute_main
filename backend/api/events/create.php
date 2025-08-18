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

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

// Basic validation
if (
    empty($data->eventTitle) ||
    empty($data->eventDate) ||
    empty($data->eventTimeHours) ||
    empty($data->eventTimeMinutes)
) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Required fields are missing."]);
    exit;
}

// Combine date and time into a single DATETIME string
$timeString = "{$data->eventTimeHours}:{$data->eventTimeMinutes}:00 {$data->eventTimePeriod}";
$formattedTime = date("H:i:s", strtotime($timeString));
$event_datetime = "{$data->eventDate} {$formattedTime}";

// SQL query to insert a new event
$query = "INSERT INTO events (event_title, description, event_datetime, location, duration_hours) VALUES (:title, :description, :datetime, :location, :duration)";

try {
    $stmt = $pdo->prepare($query);

    // Bind data
    $stmt->bindParam(':title', $data->eventTitle);
    $stmt->bindParam(':description', $data->description);
    $stmt->bindParam(':datetime', $event_datetime);
    $stmt->bindParam(':location', $data->location);
    $stmt->bindParam(':duration', $data->durationHours, PDO::PARAM_INT);

    if ($stmt->execute()) {
        http_response_code(201); // Created
        echo json_encode(["message" => "Event was created.", "eventId" => $pdo->lastInsertId()]);
    } else {
        throw new Exception("Unable to create event.");
    }
} catch (Exception $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Failed to create event.", "error" => $e->getMessage()]);
}
?>
