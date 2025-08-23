<?php
// Headers for CORS and content type
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

// Database connection
include_once '../../config/database.php';

// --- File Upload Logic ---
$uploadDir = '../../uploads/student_photos/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

function handleFileUpload($fileKey, $uploadDir) {
    if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES[$fileKey]['tmp_name'];
        $fileName = time() . '_' . uniqid() . '_' . basename($_FILES[$fileKey]['name']);
        $destPath = $uploadDir . $fileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            return $fileName;
        }
    }
    return null;
}

$studentPhotoPath = handleFileUpload('studentPhoto', $uploadDir);
// resultPath abhi ke liye null rakhte hain kyunki ye create par nahi, update par aayega
$resultPath = null; 

// --- Get Data from POST ---
// React form se bheja gaya data
$studentName = $_POST['studentName'] ?? '';
$password = $_POST['password'] ?? '';
$fatherName = $_POST['fatherName'] ?? '';
$gender = $_POST['gender'] ?? '';
$schoolName = $_POST['schoolName'] ?? '';
$mobileNumber = $_POST['mobileNumber'] ?? '';
$dateOfBirth = $_POST['dateOfBirth'] ?? null;
$cast = $_POST['cast'] ?? '';
$aadharCardNumber = $_POST['aadharCardNumber'] ?? '';
$fullAddress = $_POST['fullAddress'] ?? '';

// Sabse important: Selected courses ka array
// React se `selectedCourses[]` bhej rahe hain, to PHP isko ek array ki tarah receive karega
$selectedCourses = $_POST['selectedCourses'] ?? [];

// --- Basic Validation ---
if (empty($studentName) || empty($password) || empty($mobileNumber) || empty($selectedCourses)) {
    http_response_code(400);
    echo json_encode(['message' => 'Required fields are missing: studentName, password, mobileNumber, and at least one course.']);
    exit;
}

// Validate if selectedCourses is actually an array
if (!is_array($selectedCourses)) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid format for selected courses.']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// --- Database Insertion with Transaction ---
try {
    // 1. Transaction Shuru Karein
    $pdo->beginTransaction();

    // 2. Student ko `students` table mein insert karein (bina course aur course_price ke)
    $sqlStudent = "INSERT INTO students 
        (student_photo, student_name, password, father_name, gender, school_name, mobile_number, date_of_birth, cast, aadhar_card_number, full_address) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    $stmtStudent = $pdo->prepare($sqlStudent);
    
    $stmtStudent->execute([
        $studentPhotoPath,
        $studentName,
        $hashedPassword,
        $fatherName,
        $gender,
        $schoolName,
        $mobileNumber,
        $dateOfBirth,
        $cast,
        $aadharCardNumber,
        $fullAddress,
    
    ]);
    
    // Naye student ki ID prapt karein
    $lastStudentId = $pdo->lastInsertId();

    // 3. Har selected course ke liye `student_courses` junction table mein entry karein
    if ($lastStudentId && !empty($selectedCourses)) {
        $sqlStudentCourse = "INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)";
        $stmtStudentCourse = $pdo->prepare($sqlStudentCourse);

        foreach ($selectedCourses as $courseId) {
            // Har course ID ke liye statement execute karein
            $stmtStudentCourse->execute([$lastStudentId, $courseId]);
        }
    }

    // 4. Sab kuch theek raha, to transaction ko commit (save) karein
    $pdo->commit();
    
    // Success response
    http_response_code(201);
    echo json_encode([
        'message' => 'Student and course enrollments created successfully.',
        'studentId' => $lastStudentId
    ]);

} catch (PDOException $e) {
    // 5. Agar koi bhi error aati hai, to transaction ko rollback (undo) karein
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    
    // Error response
    http_response_code(500);
    if ($e->getCode() == '23000') {
        echo json_encode(['message' => 'This mobile number is already registered.']);
    } else {
        echo json_encode(['message' => 'Failed to create student.', 'error' => $e->getMessage()]);
    }
}

// Close connection
$pdo = null;
?>
