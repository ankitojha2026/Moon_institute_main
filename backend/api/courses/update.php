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

// Check for ID
$id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT) : null;
if (!$id) {
    http_response_code(400);
    echo json_encode(["message" => "Course ID is required."]);
    exit;
}

// Get data from POST (since we use form-data for file uploads)
$courseName = $_POST['courseName'] ?? null;
$price = $_POST['price'] ?? null;

// File upload handling
$uploadDir = '../../uploads/course_pdfs/';
$pdfPath = null;
if (isset($_FILES['coursePdf']) && $_FILES['coursePdf']['error'] === UPLOAD_ERR_OK) {
    // First, get the old PDF path to delete it later
    $stmt_old = $pdo->prepare("SELECT course_pdf_path FROM courses WHERE id = :id");
    $stmt_old->bindParam(':id', $id);
    $stmt_old->execute();
    $old_pdf = $stmt_old->fetchColumn();

    // Upload the new file
    $fileName = uniqid() . '-' . basename($_FILES['coursePdf']['name']);
    $targetPath = $uploadDir . $fileName;
    if (move_uploaded_file($_FILES['coursePdf']['tmp_name'], $targetPath)) {
        $pdfPath = $fileName;
        // Delete the old file if it exists
        if ($old_pdf && file_exists($uploadDir . $old_pdf)) {
            unlink($uploadDir . $old_pdf);
        }
    }
}

try {
    $query_parts = [];
    $params = [];

    if ($courseName !== null) { $query_parts[] = "course_name = :courseName"; $params[':courseName'] = $courseName; }
    if ($price !== null) { $query_parts[] = "price = :price"; $params[':price'] = $price; }
    if ($pdfPath !== null) { $query_parts[] = "course_pdf_path = :pdfPath"; $params[':pdfPath'] = $pdfPath; }

    if (empty($query_parts)) {
        http_response_code(400);
        echo json_encode(["message" => "No data provided for update."]);
        exit;
    }

    $params[':id'] = $id;
    $query = "UPDATE courses SET " . implode(', ', $query_parts) . " WHERE id = :id";
    
    $stmt = $pdo->prepare($query);

    if ($stmt->execute($params)) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(["message" => "Course was updated."]);
        } else {
            http_response_code(200); // Or 304 Not Modified
            echo json_encode(["message" => "No changes were made to the course."]);
        }
    } else {
        throw new Exception("Unable to update course.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to update course.", "error" => $e->getMessage()]);
}
?>
