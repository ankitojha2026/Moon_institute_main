<?php
$host = 'localhost';
$dbname = 'moondb'; // Aapka DB ka naam
$username = 'root';              // Aapka DB username
$password = '';                  // Aapka DB password
$charset = 'utf8mb4';

// Data Source Name (DSN)
$dsn = "mysql:host=$host;dbname=$dbname;charset=$charset";

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Errors ko exception ki tarah throw karega
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Hamesha associative array return karega
    PDO::ATTR_EMULATE_PREPARES   => false,                  // Real prepared statements use karega
];

try {
    // Create a PDO instance (connect to the database)
    $pdo = new PDO($dsn, $username, $password, $options);
    echo json_encode("dtabase connected successfully");;
} catch (\PDOException $e) {
    // Agar connection fail hota hai to
    http_response_code(500);
    echo json_encode([
        'message' => 'Database connection failed.',
        'error' => $e->getMessage()
    ]);
    exit;
}
?>
