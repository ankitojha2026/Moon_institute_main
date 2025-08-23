<?php
// Headers
header("Access-Control-Allow-Origin: *"); // Production mein `http://localhost:8080` use karna behtar hai
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

try {
    // --- UPDATED SQL QUERY ---
    // Hum teen tables ko join kar rahe hain:
    // 1. `students` (s) - Student ki main details ke liye
    // 2. `student_courses` (sc) - Student aur course ke beech ka link
    // 3. `courses` (c) - Course ka naam lene ke liye
    $query = "
        SELECT 
            s.id, 
            s.student_name, 
            s.father_name, 
            s.gender, 
            s.mobile_number, 
            s.full_address, 
            s.student_photo,
            -- GROUP_CONCAT student ke saare courses ko ek comma-separated string mein jod dega
            GROUP_CONCAT(c.course_name SEPARATOR ', ') AS enrolled_courses
        FROM 
            students s
        LEFT JOIN 
            student_courses sc ON s.id = sc.student_id
        LEFT JOIN 
            courses c ON sc.course_id = c.id
        GROUP BY 
            s.id -- Yeh zaroori hai taaki har student ke liye ek hi row aaye
        ORDER BY 
            s.created_at DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $num = $stmt->rowCount();

    if ($num > 0) {
        $students_arr = [];
        $students_arr["records"] = [];

        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // Pura URL banao photo ke liye
            $photo_url = !empty($row['student_photo']) 
                ? "http://localhost/moon/backend/uploads/student_photos/" . $row['student_photo'] 
                : null;

            // Student item ka naya structure
            $student_item = [
                "id" => $row['id'],
                "studentName" => $row['student_name'],
                "fatherName" => $row['father_name'],
                "gender" => $row['gender'],
                // `course` ki jagah ab humara naya `enrolled_courses` field
                "enrolledCourses" => $row['enrolled_courses'] ?? 'No courses enrolled', // Agar koi course nahi hai to default text
                "mobileNumber" => $row['mobile_number'],
                "fullAddress" => $row['full_address'],
                "studentPhotoUrl" => $photo_url
            ];

            array_push($students_arr["records"], $student_item);
        }

        http_response_code(200);
        echo json_encode($students_arr);

    } else {
        http_response_code(404);
        echo json_encode(["message" => "No students found."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to fetch students.", "error" => $e->getMessage()]);
}

// Close connection
$pdo = null;
?>
