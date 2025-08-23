<?php
// Headers
header("Access-Control-Allow-Origin: http://localhost:8080"); // Production mein  use karein
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST,DELETE , OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->id)) {
    http_response_code(400);
    echo json_encode(["message" => "Student ID is required."]);
    exit;
}

try {
    $pdo->beginTransaction();

    // STEP 1: Server se purani photo file delete karo
    // Pehle photo ka naam database se fetch karo
    $stmtSelect = $pdo->prepare("SELECT student_photo FROM students WHERE id = ?");
    $stmtSelect->execute([$data->id]);
    $student = $stmtSelect->fetch(PDO::FETCH_ASSOC);

    if ($student && !empty($student['student_photo'])) {
        $filePath = '../../uploads/student_photos/' . $student['student_photo'];
        if (file_exists($filePath)) {
            unlink($filePath); // File ko delete karo
        }
    }

    // STEP 2: Database se student ko delete karo
    // ON DELETE CASCADE `student_courses` se entries automatically hata dega.
    $query = "DELETE FROM students WHERE id = ?";
    $stmt = $pdo->prepare($query);

    if ($stmt->execute([$data->id])) {
        if ($stmt->rowCount() > 0) {
            $pdo->commit(); // Sab theek hai, commit karo
            http_response_code(200);
            echo json_encode(["message" => "Student was deleted."]);
        } else {
            $pdo->rollBack(); // Rollback agar student mila hi nahi
            http_response_code(404);
            echo json_encode(["message" => "Student not found."]);
        }
    } else {
        throw new Exception("Unable to execute delete statement.");
    }
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["message" => "Unable to delete student.", "error" => $e->getMessage()]);
}
?>
