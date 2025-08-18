<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, PUT"); // Allow POST for forms

// Include database
include_once '../../config/database.php';

// Get ID from URL
$id = isset($_GET['id']) ? $_GET['id'] : die(json_encode(["message" => "Student ID is required."]));

// Get posted data
// Note: We use $_POST because multipart/form-data with PUT is tricky.
// The frontend should send a POST request here for updates.
$data = $_POST;

if(empty($data) && empty($_FILES)) {
    http_response_code(400);
    echo json_encode(["message" => "No data provided for update."]);
    exit;
}

try {
    $query_parts = [];
    $params = [];
    $types = '';

    foreach ($data as $key => $value) {
        // Rename keys to match DB columns (studentName -> student_name)
        $column = lcfirst(str_replace(' ', '', ucwords(str_replace('_', ' ', $key))));
        $column = preg_replace('/(?<!^)[A-Z]/', '_$0', $column);
        $db_column = strtolower($column);

        // Skip ID field and handle password separately
        if ($db_column === 'id' || $db_column === 'password') continue;
        
        $query_parts[] = "{$db_column} = ?";
        $params[] = $value;
    }

    // Handle password update
    if (!empty($data['password'])) {
        $query_parts[] = "password = ?";
        $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
    }
    
    // TODO: Handle file updates (delete old file, save new one)

    if(empty($query_parts)) {
        http_response_code(400);
        echo json_encode(["message" => "No valid fields to update."]);
        exit;
    }

    // Construct the final query
    $query = "UPDATE students SET " . implode(', ', $query_parts) . " WHERE id = ?";
    $params[] = $id;

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    if ($stmt->rowCount() > 0) {
        http_response_code(200);
        echo json_encode(array("message" => "Student was updated."));
    } else {
        // rowCount is 0 if no data was changed, or student not found
        http_response_code(200); // or 304 Not Modified
        echo json_encode(array("message" => "No changes were made to the student record."));
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Unable to update student.", "error" => $e->getMessage()));
}
?>
