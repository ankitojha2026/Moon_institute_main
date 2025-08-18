<?php
// Include CORS and database configuration
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

try {
    // This is a powerful SQL query to get today's and upcoming birthdays together.
    // It correctly handles year-end wrapping (e.g., if today is Dec 30, it will find Jan 2 birthdays).
    $query = "
        SELECT 
            id, 
            student_name, 
            date_of_birth, 
            student_photo, 
            course
        FROM 
            students
        -- Order by the next occurrence of their birthday from today
        ORDER BY 
            CASE
                -- If birthday is today or later in the year, sort by its day number
                WHEN DAYOFYEAR(date_of_birth) >= DAYOFYEAR(CURDATE()) 
                THEN DAYOFYEAR(date_of_birth)
                -- If birthday has already passed, sort it for next year (add 366)
                ELSE DAYOFYEAR(date_of_birth) + 366 
            END
        LIMIT 7
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $num = $stmt->rowCount();
    $students_arr = ["records" => []];

    if ($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            extract($row);
            
            $photo_url = !empty($student_photo) ? "http://{$_SERVER['HTTP_HOST']}/moon/backend/uploads/student_photos/{$student_photo}" : null;

            $student_item = [
                "id" => $id,
                "studentName" => $student_name,
                "dateOfBirth" => $date_of_birth,
                "studentPhotoUrl" => $photo_url,
                "course" => $course,
            ];
            array_push($students_arr["records"], $student_item);
        }
    }

    http_response_code(200);
    echo json_encode($students_arr);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to fetch birthday feed.", "error" => $e->getMessage()]);
}
?>
