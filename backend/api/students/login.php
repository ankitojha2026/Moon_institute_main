<?php
// Headers (No change needed here, they are perfect)
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));



// UPDATED: Check for 'studentName' to match the React component
if (empty($data->studentName) || empty($data->password) || empty($data->phoneNumber)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Student name and password are required."]);
    exit;
}

try {
    // UPDATED: Select all student data and use student_name for lookup
    $query = "SELECT * FROM students WHERE mobile_number = :mobileNumber LIMIT 1";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':mobileNumber', $data->phoneNumber);
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        $student = $stmt->fetch(PDO::FETCH_ASSOC);
        // Verify password
        if (password_verify($data->password, $student['password'])) {
            // Login successful!
            
            
            // --- IMPORTANT: Remove password before sending data to client ---
            unset($student['password']);

            // --- IMPROVEMENT: Add full photo URL ---
            $photo_url = !empty($student['student_photo']) 
                ? "http://{$_SERVER['HTTP_HOST']}/moon/backend/uploads/student_photos/{$student['student_photo']}" 
                : null;
            $student['studentPhotoUrl'] = $photo_url;
            
            http_response_code(200);
            // --- UPDATED: Send a structured response with all student data ---
            echo json_encode([
                "success" => true,
                "message" => "Login successful.",
                "data" => $student
            ]);
        } else {
            // Invalid password
            http_response_code(401);
            echo json_encode(["success" => false, "message" => "Invalid credentials provided."]);
        }
    } else {
        // Student not found
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "No student found with that name."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Login failed due to a server error.", "error" => $e->getMessage()]);
}
?>
