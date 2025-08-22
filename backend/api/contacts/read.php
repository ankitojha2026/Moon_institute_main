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

// Base query
$query = "SELECT * FROM contacts";
$conditions = [];
$params = [];

// Handle search term
if (!empty($_GET['search'])) {
    $searchTerm = '%' . $_GET['search'] . '%';
    $conditions[] = "(first_name LIKE :search OR last_name LIKE :search OR email LIKE :search OR phone_number LIKE :search)";
    $params[':search'] = $searchTerm;
}

// Handle status filter
if (!empty($_GET['status'])) {
    $conditions[] = "status = :status";
    $params[':status'] = $_GET['status'];
}

// Append conditions to the query
if (count($conditions) > 0) {
    $query .= " WHERE " . implode(' AND ', $conditions);
}

// Add ordering
$query .= " ORDER BY created_at DESC";

try {
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    $contacts_arr = ["records" => []];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($contacts_arr["records"], $row);
    }

    http_response_code(200);
    echo json_encode($contacts_arr);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Unable to fetch contacts.", "error" => $e->getMessage()]);
}
?>
