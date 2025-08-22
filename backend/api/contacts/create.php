<?php
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
include_once '../../config/database.php';

$data = json_decode(file_get_contents("php://input"));

if (empty($data->firstName) || empty($data->email) || empty($data->phoneNumber)) {
    http_response_code(400);
    echo json_encode(["message" => "Required fields are missing."]);
    exit;
}

$query = "INSERT INTO contacts (first_name, last_name, email, phone_number, course_interest, message) VALUES (:firstName, :lastName, :email, :phone, :course, :message)";

try {
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':firstName', $data->firstName);
    $stmt->bindParam(':lastName', $data->lastName);
    $stmt->bindParam(':email', $data->email);
    $stmt->bindParam(':phone', $data->phoneNumber);
    $stmt->bindParam(':course', $data->courseInterest);
    $stmt->bindParam(':message', $data->message);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["message" => "Enquiry submitted successfully."]);
    } else {
        throw new Exception("Unable to submit enquiry.");
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["message" => "Failed to submit enquiry.", "error" => $e->getMessage()]);
}
?>
