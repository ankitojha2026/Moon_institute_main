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

// Get raw posted data (expects JSON: {"id": 123})
$data = json_decode(file_get_contents("php://input"));
$id = isset($data->id) ? filter_var($data->id, FILTER_VALIDATE_INT) : null;

if (!$id) {
    http_response_code(400);
    echo json_encode(["message" => "Course ID is required."]);
    exit;
}

try {
    // Step 1: Get the PDF path before deleting the record
    $stmt_select = $pdo->prepare("SELECT course_pdf_path FROM courses WHERE id = :id");
    $stmt_select->bindParam(':id', $id);
    $stmt_select->execute();
    $pdf_path = $stmt_select->fetchColumn();
    
    // Step 2: Delete the database record
    $query = "DELETE FROM courses WHERE id = :id";
    $stmt_delete = $pdo->prepare($query);
    $stmt_delete->bindParam(':id', $id);

    if ($stmt_delete->execute()) {
        if ($stmt_delete->rowCount() > 0) {
            // Step 3: If record was deleted, delete the associated file
            if ($pdf_path && file_exists('../../uploads/course_pdfs/' . $pdf_path)) {
                unlink('../../uploads/course_pdfs/' . $pdf_path);
            }
            http_response_code(200);
            echo json_encode(["message" => "Course was deleted."]);
        } else {
            // No rows affected means the ID was not found
            http_response_code(404);
            echo json_encode(["message" => "Course not found."]);
        }
    } else {
        throw new Exception("Database query failed.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to delete course.", "error" => $e->getMessage()]);
}
?>
