<?php // backend/api/results/create.php
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

include_once '../../config/database.php';
$data = json_decode(file_get_contents("php://input"));

if (
    empty($data->student_id) ||
    empty($data->course_id) ||
    empty($data->test_name) ||
    !isset($data->marks_obtained) ||
    !isset($data->total_marks)
) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "All fields are required."]);
    exit;
}

try {
    $query = "INSERT INTO results (student_id, course_id, test_name, marks_obtained, total_marks, test_date) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        $data->student_id,
        $data->course_id,
        $data->test_name,
        $data->marks_obtained,
        $data->total_marks,
        $data->test_date ?? null
    ]);
    
    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Result added successfully."]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to add result.", "error" => $e->getMessage()]);
}
?>
