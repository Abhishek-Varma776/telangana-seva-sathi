
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
$sql = "SELECT id, name, email, password FROM citizens WHERE email = ?";

// Prepare statement
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $email);

// Execute statement
$stmt->execute();

// Bind result variables
$stmt->bind_result($id, $name, $email, $hashedPassword);

// Fetch result
if ($stmt->fetch()) {
    // Verify password
    if (password_verify($password, $hashedPassword)) {
        // Start session
        session_start();
        $_SESSION['citizen_id'] = $id;
        $_SESSION['citizen_name'] = $name;
        $_SESSION['citizen_email'] = $email;
        $_SESSION['user_type'] = 'citizen';
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'Login successful',
            'user' => [
                'id' => $id,
                'name' => $name,
                'email' => $email
            ]
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Invalid password']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'User not found']);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
