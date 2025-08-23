<?php
header("Access-Control-Allow-Origin: *"); // Production mein http://localhost:8080 use karein
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
include_once '../../config/database.php';

try {
    $sql = "
        SELECT 
            s.id,
            s.student_name,
            s.student_photo,
            r.marks_obtained,
            r.total_marks,
            c.course_name
        FROM 
            students s
        LEFT JOIN 
            results r ON s.id = r.student_id
        LEFT JOIN 
            courses c ON r.course_id = c.id
        ORDER BY s.id;
    ";
    $stmt = $pdo->query($sql);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $students = [];
    foreach ($results as $row) {
        $studentId = $row['id'];
        if (!isset($students[$studentId])) {
            $students[$studentId] = [
                'id' => $studentId,
                'name' => $row['student_name'],
                'image' => !empty($row['student_photo']) ? "http://{$_SERVER['HTTP_HOST']}/moon/backend/uploads/student_photos/{$row['student_photo']}" : 'https://i.pravatar.cc/150?img=' . $studentId,
                'courses' => []
            ];
        }
        if ($row['course_name']) {
            $students[$studentId]['courses'][] = [
                'name' => $row['course_name'],
                'marks' => (float)$row['marks_obtained'],
                'maxMarks' => (float)$row['total_marks']
            ];
        }
    }

    echo json_encode(array_values($students));

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to fetch data.', 'error' => $e->getMessage()]);
}
?>
