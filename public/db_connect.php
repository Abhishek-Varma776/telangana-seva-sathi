
<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "telangana_seva_sathi";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['status' => 'error', 'message' => "Connection failed: " . $conn->connect_error]));
}

// Set character set to UTF-8
$conn->set_charset("utf8mb4");

// Function to sanitize input data
function sanitizeInput($data) {
    global $conn;
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    $data = $conn->real_escape_string($data);
    return $data;
}

// Success message for direct access
if (basename($_SERVER['PHP_SELF']) === 'db_connect.php') {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'message' => 'Database connection successful']);
    exit;
}
// Return connection silently for includes
?>
