
<?php
// Include database connection
require_once 'db_connect.php';

// Set header to accept JSON requests
header('Content-Type: application/json');

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

// Get data from request
$data = json_decode(file_get_contents('php://input'), true);

// Check if all required fields are present
$requiredFields = ['name', 'employeeId', 'email', 'phone', 'department', 'designation', 'district', 'password'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(['status' => 'error', 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize input data
$name = sanitizeInput($data['name']);
$employeeId = sanitizeInput($data['employeeId']);
$email = sanitizeInput($data['email']);
$phone = sanitizeInput($data['phone']);
$department = sanitizeInput($data['department']);
$designation = sanitizeInput($data['designation']);
$district = sanitizeInput($data['district']);
$password = password_hash($data['password'], PASSWORD_DEFAULT); // Hash password

// Check if email or employee ID already exists
$checkSql = "SELECT id FROM officers WHERE email = ? OR employee_id = ? LIMIT 1";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("ss", $email, $employeeId);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    echo json_encode(['status' => 'error', 'message' => 'Email or Employee ID already registered']);
    exit;
}
$checkStmt->close();

// Prepare SQL statement
$sql = "INSERT INTO officers (name, employee_id, email, phone, department, designation, district, password, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";

// Prepare statement
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssssss", $name, $employeeId, $email, $phone, $department, $designation, $district, $password);

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
