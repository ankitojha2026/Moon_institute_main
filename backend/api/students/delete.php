<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: DELETE");

// Include database
include_once '../../config/database.php';

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

if (empty($data->id)) {
    http_response_code(400);
    echo json_encode(["message" => "Student ID is required."]);
    exit;
}

try {
    // TODO: First, select the record to get file paths to delete them from server

    // Delete query
    $query = "DELETE FROM students WHERE id = ?";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(1, $data->id);

    if ($stmt->execute()) {
        if ($stmt->rowCount() > 0) {
            http_response_code(200);
            echo json_encode(array("message" => "Student was deleted."));
        } else {
            http_response_code(404);
            echo json_encode(array("message" => "Student not found."));
        }
    } else {
        throw new Exception("Unable to execute delete statement.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Unable to delete student.", "error" => $e->getMessage()));
}
?>
