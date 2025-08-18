<?php
// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Include database
include_once '../../config/database.php';

// Get ID from URL
$id = isset($_GET['id']) ? $_GET['id'] : die();

try {
    // Prepare a select query
    $query = "SELECT * FROM students WHERE id = ? LIMIT 0,1";

    $stmt = $pdo->prepare($query);
    $stmt->bindParam(1, $id);
    $stmt->execute();
    
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if($row) {
        // Create array
        $student_arr = array(
            "id" => $row['id'],
            "studentName" => $row['student_name'],
            "password" => "********", // Never send the real password
            "fatherName" => $row['father_name'],
            "gender" => $row['gender'],
            "course" => $row['course'],
            "coursePrice" => $row['course_price'],
            "schoolName" => $row['school_name'],
            "mobileNumber" => $row['mobile_number'],
            "dateOfBirth" => $row['date_of_birth'],
            "cast" => $row['cast'],
            "aadharCardNumber" => $row['aadhar_card_number'],
            "fullAddress" => $row['full_address'],
            "studentPhotoUrl" => !empty($row['student_photo']) ? "http://{$_SERVER['HTTP_HOST']}/uploads/student_photos/{$row['student_photo']}" : null,
            "resultUrl" => !empty($row['result_path']) ? "http://{$_SERVER['HTTP_HOST']}/uploads/student_results/{$row['result_path']}" : null,
            "createdAt" => $row['created_at']
        );

        http_response_code(200);
        echo json_encode($student_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "Student not found."));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Unable to fetch student.", "error" => $e->getMessage()));
}
?>
