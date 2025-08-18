<?php
// Headers
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

// Include database and object files
include_once '../../config/database.php';

try {
    // Prepare a select query
    $query = "SELECT id, student_name, father_name, gender, course, mobile_number, full_address, student_photo FROM students ORDER BY created_at DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $num = $stmt->rowCount();

    // Check if more than 0 record found
    if ($num > 0) {
        $students_arr = array();
        $students_arr["records"] = array();

        // Retrieve our table contents
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            // extract row
            // this will make $row['name'] to just $name only
            extract($row);
            
            // Add a full URL path for the photo
            $photo_url = !empty($student_photo) 
    ? "http://localhost/moon/backend/uploads/student_photos/" . $student_photo 
    : null;

            $student_item = array(
                "id" => $id,
                "studentName" => $student_name,
                "fatherName" => $father_name,
                "gender" => $gender,
                "course" => $course,
                "mobileNumber" => $mobile_number,
                "fullAddress" => $full_address,
                "studentPhotoUrl" => $photo_url
            );

            array_push($students_arr["records"], $student_item);
        }

        http_response_code(200);
        echo json_encode($students_arr);
    } else {
        http_response_code(404);
        echo json_encode(array("message" => "No students found."));
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(array("message" => "Unable to fetch students.", "error" => $e->getMessage()));
}
?>
