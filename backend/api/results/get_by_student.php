<?php // backend/api/results/get_by_student.php
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

$student_id = isset($_GET['student_id']) ? $_GET['student_id'] : die();

try {
    $query = "
        SELECT 
            r.id, 
            r.test_name, 
            r.marks_obtained, 
            r.total_marks, 
            r.test_date, 
            c.course_name 
        FROM 
            results r
        JOIN 
            courses c ON r.course_id = c.id
        WHERE 
            r.student_id = ?
        ORDER BY 
            r.test_date DESC, c.course_name
    ";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$student_id]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["success" => true, "records" => $results]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Failed to fetch results."]);
}
?>
