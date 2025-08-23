<?php
// Include CORS and database configuration
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

include_once '../../config/database.php';

try {
    // --- UPDATED SQL QUERY ---
    // Humne ismein bhi `LEFT JOIN` aur `GROUP_CONCAT` ko add kiya hai
    $query = "
        SELECT 
            s.id, 
            s.student_name, 
            s.date_of_birth, 
            s.student_photo,
            -- Student ke saare courses ko ek string mein jod do
            GROUP_CONCAT(c.course_name SEPARATOR ', ') AS enrolled_courses
        FROM 
            students s
        LEFT JOIN 
            student_courses sc ON s.id = sc.student_id
        LEFT JOIN 
            courses c ON sc.course_id = c.id
        -- WHERE s.date_of_birth IS NOT NULL -- Optional: Sirf unko consider karo jinka DOB hai
        GROUP BY
            s.id -- Har student ke liye ek row
        -- Birthday ke hisaab se order karne ka logic waise hi rahega
        ORDER BY 
            CASE
                WHEN DAYOFYEAR(s.date_of_birth) >= DAYOFYEAR(CURDATE()) 
                THEN DAYOFYEAR(s.date_of_birth)
                ELSE DAYOFYEAR(s.date_of_birth) + 366 
            END
        LIMIT 7
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    
    $num = $stmt->rowCount();
    $students_arr = ["records" => []];

    if ($num > 0) {
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            
            $photo_url = !empty($row['student_photo']) 
                ? "http://{$_SERVER['HTTP_HOST']}/moon/backend/uploads/student_photos/{$row['student_photo']}" 
                : null;

            // Naya structure `enrolled_courses` ke saath
            $student_item = [
                "id" => $row['id'],
                "studentName" => $row['student_name'],
                "dateOfBirth" => $row['date_of_birth'],
                "studentPhotoUrl" => $photo_url,
                "enrolledCourses" => $row['enrolled_courses'] ?? 'No courses enrolled'
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

$pdo = null;
?>
