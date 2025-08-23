<?php
// Headers
header("Access-Control-Allow-Origin: *"); // Production mein http://localhost:8080 use karein
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

// Yahan mobileNumber use kar rahe hain, jo aam taur par unique hota hai.
if (empty($data->phoneNumber) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Mobile number and password are required."]);
    exit;
}

try {
    // Step 1: Student ko mobile number se find karo
    $query = "SELECT * FROM students WHERE mobile_number = :mobileNumber LIMIT 1";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':mobileNumber', $data->phoneNumber);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $student = $stmt->fetch(PDO::FETCH_ASSOC);

        // Step 2: Password verify karo
        if (password_verify($data->password, $student['password'])) {
            // Login successful!
            
            // Step 3: Student ke enrolled courses fetch karo
            $sqlCourses = "
                SELECT c.id, c.course_name, c.price, c.course_pdf_path
                FROM student_courses sc
                JOIN courses c ON sc.course_id = c.id
                WHERE sc.student_id = ?
            ";
            $stmtCourses = $pdo->prepare($sqlCourses);
            $stmtCourses->execute([$student['id']]);
            $enrolledCourses = $stmtCourses->fetchAll(PDO::FETCH_ASSOC);

            // Response se sensitive data hata do
            unset($student['password']);
            
            // Student object mein courses ki details add karo
            $student['enrolledCourses'] = $enrolledCourses;
            
            // Photo ka poora URL add karo
            $student['studentPhotoUrl'] = !empty($student['student_photo']) 
                ? "http://{$_SERVER['HTTP_HOST']}/moon/backend/uploads/student_photos/{$student['student_photo']}" 
                : null;
            
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Login successful.",
                "data" => $student // Ab 'data' mein student details + courses hain
            ]);

        } else {
            // Invalid password
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Invalid credentials provided."]);
        }
    } else {
        // Student not found with the given mobile number
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No student found with that mobile number."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Login failed due to a server error.", "error" => $e->getMessage()]);
}

$pdo = null;
?>
