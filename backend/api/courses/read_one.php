<?php
// Headers
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
// Include database
include_once '../../config/database.php';

// Check if ID is provided in the URL
$id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT) : null;

if (!$id) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Course ID is missing or invalid."]);
    exit;
}

try {
    // SQL query to select a single course
    $query = "SELECT id, course_name, price, course_pdf_path, created_at FROM courses WHERE id = :id LIMIT 1";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if($row) {
        extract($row);
        
        // Construct the full URL for the PDF
        $pdf_url = !empty($course_pdf_path) ? "http://{$_SERVER['HTTP_HOST']}/your_project_name/uploads/course_pdfs/{$course_pdf_path}" : null;
        
        // Create course array
        $course_arr = [
            "id" => $id,
            "courseName" => $course_name,
            "price" => $price,
            "coursePdfUrl" => $pdf_url,
            "createdAt" => $created_at
        ];

        http_response_code(200);
        echo json_encode($course_arr);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Course not found."]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to fetch course.", "error" => $e->getMessage()]);
}
?>
