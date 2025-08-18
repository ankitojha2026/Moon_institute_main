<?php
// PDO Database connection file
include '../../config/database.php';

// Headers (same as before)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// ... (File upload logic - ismein koi change nahi hai) ...
$uploadDir = '../../uploads/course_pdfs/';
if (!is_dir($uploadDir)) { mkdir($uploadDir, 0755, true); }
function handleFileUpload($fileKey, $uploadDir) { /* ... same code ... */ }
$coursePdfPath = handleFileUpload('coursePdf', $uploadDir); 

// ... (Get Data from $_POST - ismein koi change nahi hai) ...
$courseName = $_POST['courseName'] ?? '';
$price = $_POST['price'] ?? '';

// Basic Validation
if (empty($courseName) || empty($price)) {
    http_response_code(400);
    echo json_encode(['message' => 'Required fields are missing: courseName, price.']);
    exit;
}

// --- Database Insertion using PDO ---
$sql = "INSERT INTO courses (course_name, price, course_pdf_path) VALUES (?, ?, ?)";

try {
    $stmt = $pdo->prepare($sql);
    
    // Execute with an array of values
    $stmt->execute([$courseName, $price, $coursePdfPath]);
    
    // Get the last inserted ID
    $lastId = $pdo->lastInsertId();
    
    http_response_code(201); // Created
    echo json_encode(['message' => 'Course created successfully.', 'courseId' => $lastId]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to create course.', 'error' => $e->getMessage()]);
}

// Close connection
$pdo = null;
?>
