<?php
// PDO Database connection file
include '../../config/database.php';

// Headers (same as before)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// ... (File upload logic - ismein koi change nahi hai) ...
$uploadDir = '../../uploads/student_photos/';
if (!is_dir($uploadDir)) { mkdir($uploadDir, 0755, true); }
function handleFileUpload($fileKey, $uploadDir) { /* ... same code ... */ }
$studentPhotoPath = handleFileUpload('studentPhoto', $uploadDir);
$resultPath = handleFileUpload('result', $uploadDir);

// ... (Get Data from $_POST - ismein bhi koi change nahi hai) ...
$studentName = $_POST['studentName'] ?? '';
$password = $_POST['password'] ?? '';
$mobileNumber = $_POST['mobileNumber'] ?? '';
// ... (baaki saari fields) ...
$fatherName = $_POST['fatherName'] ?? '';
$gender = $_POST['gender'] ?? '';
$course = $_POST['course'] ?? '';
$coursePrice = $_POST['coursePrice'] ?? null;
$schoolName = $_POST['schoolName'] ?? '';
$dateOfBirth = $_POST['dateOfBirth'] ?? null;
$cast = $_POST['cast'] ?? '';
$aadharCardNumber = $_POST['aadharCardNumber'] ?? '';
$fullAddress = $_POST['fullAddress'] ?? '';

// Basic Validation
if (empty($studentName) || empty($password) || empty($mobileNumber)) {
    http_response_code(400);
    echo json_encode(['message' => 'Required fields are missing: studentName, password, mobileNumber.']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// --- Database Insertion using PDO ---
$sql = "INSERT INTO students (student_photo, student_name, password, father_name, gender, course, course_price, school_name, mobile_number, date_of_birth, cast, aadhar_card_number, full_address, result_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

try {
    $stmt = $pdo->prepare($sql);
    
    // Execute the statement with an array of values
    $stmt->execute([
        $studentPhotoPath,
        $studentName,
        $hashedPassword,
        $fatherName,
        $gender,
        $course,
        $coursePrice,
        $schoolName,
        $mobileNumber,
        $dateOfBirth,
        $cast,
        $aadharCardNumber,
        $fullAddress,
        $resultPath
    ]);
    
    // Get the last inserted ID
    $lastId = $pdo->lastInsertId();
    
    http_response_code(201); // Created
    echo json_encode(['message' => 'Student created successfully.', 'studentId' => $lastId]);

} catch (PDOException $e) {
    http_response_code(500);
    // Check for duplicate entry error (SQLSTATE '23000')
    if ($e->getCode() == '23000') {
        echo json_encode(['message' => 'This mobile number is already registered.']);
    } else {
        echo json_encode(['message' => 'Failed to create student.', 'error' => $e->getMessage()]);
    }
}

// Close connection
$pdo = null;
?>
