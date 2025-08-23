<?php
// Headers
header("Access-Control-Allow-Origin: *"); // Production mein `http://localhost:8080` use karein
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database
include_once '../../config/database.php';

// Get ID from URL and validate it
$id = isset($_GET['id']) ? filter_var($_GET['id'], FILTER_VALIDATE_INT) : null;

if ($id === false || $id === null) {
    http_response_code(400);
    echo json_encode(["message" => "Invalid Student ID."]);
    exit();
}

try {
    // --- Query 1: Student ki basic details fetch karo ---
    $sqlStudent = "SELECT * FROM students WHERE id = ?";
    $stmtStudent = $pdo->prepare($sqlStudent);
    $stmtStudent->execute([$id]);
    
    $student = $stmtStudent->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        http_response_code(404);
        echo json_encode(["message" => "Student not found."]);
        exit;
    }

    // --- Query 2: Uss student ke saare enrolled courses fetch karo ---
    $sqlCourses = "
        SELECT 
            c.id, 
            c.course_name, 
            c.price,
            c.course_pdf_path
        FROM 
            student_courses sc
        JOIN 
            courses c ON sc.course_id = c.id
        WHERE 
            sc.student_id = ?
    ";
    $stmtCourses = $pdo->prepare($sqlCourses);
    $stmtCourses->execute([$id]);
    
    $enrolledCoursesDetails = $stmtCourses->fetchAll(PDO::FETCH_ASSOC);

    // Sirf course IDs ka ek alag array banayein (edit form ke liye)
    $enrolledCourseIds = array_map(function($course) {
        return (int)$course['id']; // Ensure IDs are integers
    }, $enrolledCoursesDetails);

    // --- Final Response Combine Karo ---
    
    // Photo aur result ke liye poora URL banayein
    $student['studentPhotoUrl'] = !empty($student['student_photo']) 
        ? "http://{$_SERVER['HTTP_HOST']}/moon/backend/uploads/student_photos/{$student['student_photo']}" 
        : null;

    // result_path ab students table mein nahi hai, to isko comment out ya hata dein.
    // $student['resultUrl'] = ...
    
    // Course details aur IDs ko final student object mein add karein
    $student['enrolled_courses_details'] = $enrolledCoursesDetails; // Full details of courses
    $student['enrolled_courses'] = $enrolledCourseIds;         // Just an array of course IDs [1, 4]

    // Ab `course`, `course_price` jaise purane fields ki zaroorat nahi
    unset($student['course']);
    unset($student['course_price']);
    unset($student['result_path']); // Yeh column ab exist nahi karta
    
    // Kabhi bhi password hash response mein na bhejें
    unset($student['password']); 

    http_response_code(200);
    echo json_encode($student);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to fetch student details.', 'error' => $e->getMessage()]);
}

$pdo = null;
?>
