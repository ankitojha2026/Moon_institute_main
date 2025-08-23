<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Update ke liye POST use kar rahe hain
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database
include_once '../../config/database.php';

// Get ID from URL
$id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT) : null;
if (!$id) {
    http_response_code(400);
    echo json_encode(["message" => "Valid Student ID is required."]);
    exit;
}

// Get POST data
$postData = $_POST;
$selectedCourses = $postData['selectedCourses'] ?? [];

// File upload logic
function handleFileUpload($fileKey, $uploadDir) { /* ... same as before ... */ return null; }
$uploadDir = '../../uploads/student_photos/';
$newPhotoPath = handleFileUpload('studentPhoto', $uploadDir);

try {
    // Transaction shuru karo
    $pdo->beginTransaction();

    // STEP 1: Student ki basic details update karo
    $query_parts = [];
    $params = [];

    // Fields jo 'students' table mein update honge
    $allowed_fields = ['student_name', 'father_name', 'gender', 'school_name', 'mobile_number', 'date_of_birth', 'cast', 'aadhar_card_number', 'full_address'];

    foreach ($postData as $key => $value) {
        $db_column = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $key));
        if (in_array($db_column, $allowed_fields)) {
            $query_parts[] = "{$db_column} = ?";
            $params[] = $value;
        }
    }

    // Password update handle karo (agar bheja gaya hai)
    if (!empty($postData['password'])) {
        $query_parts[] = "password = ?";
        $params[] = password_hash($postData['password'], PASSWORD_DEFAULT);
    }
    
    // Photo update handle karo (agar nayi photo upload hui hai)
    if ($newPhotoPath) {
        // TODO: Purani photo ko server se delete karne ka logic yahan daalein
        $query_parts[] = "student_photo = ?";
        $params[] = $newPhotoPath;
    }
    
    if (!empty($query_parts)) {
        $query = "UPDATE students SET " . implode(', ', $query_parts) . " WHERE id = ?";
        $params[] = $id;
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
    }

    // STEP 2: Course enrollments ko update karo
    // Pehle purane saare courses hata do
    $stmtDelete = $pdo->prepare("DELETE FROM student_courses WHERE student_id = ?");
    $stmtDelete->execute([$id]);

    // Ab naye courses daalo (agar select kiye gaye hain)
    if (!empty($selectedCourses)) {
        $sqlInsertCourse = "INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)";
        $stmtInsertCourse = $pdo->prepare($sqlInsertCourse);
        foreach ($selectedCourses as $courseId) {
            $stmtInsertCourse->execute([$id, $courseId]);
        }
    }

    // Sab theek raha, to transaction commit karo
    $pdo->commit();

    http_response_code(200);
    echo json_encode(["message" => "Student record updated successfully."]);

} catch (Exception $e) {
    // Koi bhi error aane par rollback karo
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode(["message" => "Unable to update student.", "error" => $e->getMessage()]);
}
?>
