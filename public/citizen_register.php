
<?php
// Set header to accept JSON requests first thing
header('Content-Type: application/json');

// Include database connection
require_once 'db_connect.php';

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

// Get data from request
$data = json_decode(file_get_contents('php://input'), true);
if ($data === null) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data received']);
    exit;
}

// Check if all required fields are present
$requiredFields = ['name', 'email', 'phone', 'aadhar', 'address', 'district', 'pincode', 'password'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(['status' => 'error', 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize input data
$name = sanitizeInput($data['name']);
$email = sanitizeInput($data['email']);
$phone = sanitizeInput($data['phone']);
$aadhar = sanitizeInput($data['aadhar']);
$address = sanitizeInput($data['address']);
$district = sanitizeInput($data['district']);
$pincode = sanitizeInput($data['pincode']);
$password = password_hash($data['password'], PASSWORD_DEFAULT); // Hash password

// Check if email already exists
$checkSql = "SELECT id FROM citizens WHERE email = ? OR aadhar = ? LIMIT 1";
$checkStmt = $conn->prepare($checkSql);
if (!$checkStmt) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$checkStmt->bind_param("ss", $email, $aadhar);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email or Aadhar number already registered']);
    $checkStmt->close();
    exit;
}
$checkStmt->close();

// Prepare SQL statement
$sql = "INSERT INTO citizens (name, email, phone, aadhar, address, district, pincode, password, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";

// Prepare statement
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("ssssssss", $name, $email, $phone, $aadhar, $address, $district, $pincode, $password);

// Execute statement
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Registration successful']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Registration failed: ' . $stmt->error]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
