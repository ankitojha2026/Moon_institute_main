<?php
// Include CORS and database configuration

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

// Get the 'limit' parameter from the URL, default to 5 if not provided
$limit = isset($_GET['limit']) ? filter_var($_GET['limit'], FILTER_VALIDATE_INT) : 5;

// Ensure limit is a positive integer
if ($limit === false || $limit <= 0) {
    $limit = 5;
}

try {
    // SQL query to get upcoming events
    // It selects events where the event_datetime is in the future
    // and orders them by the soonest first.
    $query = "
        SELECT id, event_title, description, event_datetime, location, duration_hours 
        FROM events 
        WHERE event_datetime >= NOW() 
        ORDER BY event_datetime ASC 
        LIMIT :limit
    ";
    
    $stmt = $pdo->prepare($query);
    
    // Bind the limit parameter
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    
    $stmt->execute();
    
    $num = $stmt->rowCount();

    if ($num > 0) {
        $events_arr = ["records" => []];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            // Format the date and time for easier use in the frontend
            $datetime_obj = new DateTime($event_datetime);
            
            $event_item = [
                "id" => $id,
                "eventTitle" => $event_title,
                "description" => $description,
                "location" => $location,
                "durationHours" => $duration_hours,
                "eventDate" => $datetime_obj->format('Y-m-d'), // e.g., 2025-12-25
                "eventTime" => $datetime_obj->format('h:i A'), // e.g., 05:30 PM
                "fullDateTime" => $event_datetime // Keep original for reference
            ];
            
            array_push($events_arr["records"], $event_item);
        }

        http_response_code(200);
        echo json_encode($events_arr);
    } else {
        // It's not an error if there are no upcoming events, just return an empty array
        http_response_code(200);
        echo json_encode(["records" => [], "message" => "No upcoming events found."]);
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Unable to fetch upcoming events.", "error" => $e->getMessage()]);
}
?>
