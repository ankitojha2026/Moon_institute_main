<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// Include database
include_once '../../config/database.php';

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

if (empty($data->mobileNumber) || empty($data->password)) {
    http_response_code(400);
    echo json_encode(["message" => "Mobile number and password are required."]);
    exit;
}

try {
    $query = "SELECT id, student_name, password FROM students WHERE mobile_number = ? LIMIT 0,1";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(1, $data->mobileNumber);
    $stmt->execute();
    
    $num = $stmt->rowCount();

    if ($num > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $id = $row['id'];
        $student_name = $row['student_name'];
        $password_hash = $row['password'];

        // Verify password
        if (password_verify($data->password, $password_hash)) {
            // NOTE: For a real app, generate a JWT (JSON Web Token) here for security.
            http_response_code(200);
            echo json_encode(array(
                "message" => "Login successful.",
                "studentId" => $id,
                "studentName" => $student_name
            ));
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(array("message" => "Invalid credentials."));
        }
    } else {
        http_response_code(401); // Unauthorized
        echo json_encode(array("message" => "Invalid credentials."));
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Login failed.", "error" => $e->getMessage()));
}
?>
