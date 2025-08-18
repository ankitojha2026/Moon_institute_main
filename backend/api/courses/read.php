<?php
// Headers for API response
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
// Include database connection
include_once '../../config/database.php';

try {
    // SQL query to select all courses
    $query = "SELECT id, course_name, price, course_pdf_path FROM courses ORDER BY created_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $num = $stmt->rowCount();

    // Check if any courses are found
    if ($num > 0) {
        $courses_arr = [];
        $courses_arr["records"] = [];

        // Loop through the results
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            // Construct the full URL for the PDF file
            $pdf_url = !empty($course_pdf_path) ? "http://localhost/moon/backend/uploads/course_pdfs/{$course_pdf_path}" : null;

            $course_item = [
                "id" => $id,
                "courseName" => $course_name,
                "price" => $price,
                "coursePdfUrl" => $pdf_url
            ];

            array_push($courses_arr["records"], $course_item);
        }

        http_response_code(200);
        echo json_encode($courses_arr);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "No courses found."]);
    }
} catch (PDOException $e) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Unable to fetch courses.", "error" => $e->getMessage()]);
}
?>
