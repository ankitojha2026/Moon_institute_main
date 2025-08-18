<?php
// PDO Database connection file
include '../../config/database.php';

// Headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// ------------------ File Upload Logic ------------------
$uploadDir = '../../uploads/student_photos/';
if (!is_dir($uploadDir)) { 
    mkdir($uploadDir, 0755, true); 
}

function handleFileUpload($fileKey, $uploadDir) {
    if (isset($_FILES[$fileKey]) && $_FILES[$fileKey]['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES[$fileKey]['tmp_name'];
        $fileName = time() . '_' . basename($_FILES[$fileKey]['name']); // unique filename
        $destPath = $uploadDir . $fileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            return $destPath; // return path if upload success
        }
    }
    return null; // return null if not uploaded
}

// Call for photo and result
$studentPhotoPath = handleFileUpload('studentPhoto', $uploadDir);
$resultPath = handleFileUpload('result', $uploadDir);

// ------------------ Get Data from POST ------------------
$studentName = $_POST['studentName'] ?? '';
$password = $_POST['password'] ?? '';
$mobileNumber = $_POST['mobileNumber'] ?? '';
$fatherName = $_POST['fatherName'] ?? '';
$gender = $_POST['gender'] ?? '';
$course = $_POST['course'] ?? '';
$coursePrice = $_POST['coursePrice'] ?? null;
$schoolName = $_POST['schoolName'] ?? '';
$dateOfBirth = $_POST['dateOfBirth'] ?? null;
$cast = $_POST['cast'] ?? '';
$aadharCardNumber = $_POST['aadharCardNumber'] ?? '';
$fullAddress = $_POST['fullAddress'] ?? '';

// ------------------ Basic Validation ------------------
if (empty($studentName) || empty($password) || empty($mobileNumber)) {
    http_response_code(400);
    echo json_encode(['message' => 'Required fields are missing: studentName, password, mobileNumber.']);
    exit;
}

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// ------------------ Database Insertion ------------------
$sql = "INSERT INTO students 
(student_photo, student_name, password, father_name, gender, course, course_price, school_name, mobile_number, date_of_birth, cast, aadhar_card_number, full_address, result_path) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

try {
    $stmt = $pdo->prepare($sql);
    
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
    
    $lastId = $pdo->lastInsertId();
    
    http_response_code(201);
    echo json_encode([
        'message' => 'Student created successfully.',
        'studentId' => $lastId,
        'studentPhotoPath' => $studentPhotoPath, // Debug info
        'resultPath' => $resultPath              // Debug info
    ]);

} catch (PDOException $e) {
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
