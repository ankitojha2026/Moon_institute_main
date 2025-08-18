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
    // Query to get all events, newest first
    $query = "SELECT id, event_title, description, event_datetime, location, duration_hours FROM events ORDER BY event_datetime DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $num = $stmt->rowCount();

    if ($num > 0) {
        $events_arr = ["records" => []];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            $event_item = [
                "id" => $id,
                "eventTitle" => $event_title,
                "description" => $description,
                "eventDateTime" => $event_datetime,
                "location" => $location,
                "durationHours" => $duration_hours
            ];
            array_push($events_arr["records"], $event_item);
        }

        http_response_code(200);
        echo json_encode($events_arr);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "No events found."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to fetch events.", "error" => $e->getMessage()]);
}
?>
