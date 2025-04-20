
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
if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required']);
    exit;
}

// Sanitize input data
$email = sanitizeInput($data['email']);
$password = $data['password'];

// Prepare SQL statement
$sql = "SELECT id, name, email, department, district, password FROM officers WHERE email = ?";

// Prepare statement
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);

// Execute statement
$stmt->execute();

// Bind result variables
$stmt->bind_result($id, $name, $email, $department, $district, $hashedPassword);

// Fetch result
if ($stmt->fetch()) {
    // Verify password
    if (password_verify($password, $hashedPassword)) {
        // Start session
        session_start();
        $_SESSION['officer_id'] = $id;
        $_SESSION['officer_name'] = $name;
        $_SESSION['officer_email'] = $email;
        $_SESSION['officer_department'] = $department;
        $_SESSION['officer_district'] = $district;
        $_SESSION['user_type'] = 'officer';
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'Login successful',
            'user' => [
                'id' => $id,
                'name' => $name,
                'email' => $email,
                'department' => $department,
                'district' => $district
            ]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid password']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Officer not found']);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
