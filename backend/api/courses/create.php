<?php
// PDO Database connection file
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
include '../../config/database.php';

// Headers (same as before)

// ... (File upload logic - ismein koi change nahi hai) ...
$uploadDir = '../../uploads/course_pdfs/';
if (!is_dir($uploadDir)) { mkdir($uploadDir, 0755, true); }


function handleFileUpload($fileKey, $uploadDir) {
    if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES[$fileKey]['tmp_name'];
        $fileName = time() . '_' . basename($_FILES[$fileKey]['name']); // unique filename
        $destPath = $uploadDir . $fileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            return $fileName; // ✅ sirf file ka naam return karo
        }
    }
    return null;
}




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
