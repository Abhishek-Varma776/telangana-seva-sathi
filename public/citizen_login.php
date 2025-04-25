
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

// Check if JSON was parsed correctly
if ($data === null) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid JSON data received']);
    exit;
}

// Check if all required fields are present
if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'Email and password are required']);
    exit;
}

// Sanitize input data
$email = isset($data['email']) ? sanitizeInput($data['email']) : '';
$password = isset($data['password']) ? $data['password'] : '';

// If we're in an environment where PHP/MySQL might not be fully operational
// Use mock data instead of actual database
if (!function_exists('mysqli_init') || !$conn || $conn->connect_error) {
    $result = mockDatabaseLogin($email, $password);
    if ($result['status'] === 'success') {
        // Start session if possible
        if (function_exists('session_start')) {
            session_start();
            $_SESSION['citizen_id'] = $result['user']['id'];
            $_SESSION['citizen_name'] = $result['user']['name'];
            $_SESSION['citizen_email'] = $result['user']['email'];
            $_SESSION['user_type'] = 'citizen';
        }
        
        echo json_encode([
            'status' => 'success', 
            'message' => 'Login successful',
            'user' => $result['user']
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => $result['message']]);
    }
    exit;
}

// Continue with actual database query if database connection is available
try {
    // Prepare SQL statement
    $sql = "SELECT id, name, email, password FROM citizens WHERE email = ?";

    // Prepare statement
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param("s", $email);

    // Execute statement
    if (!$stmt->execute()) {
        echo json_encode(['status' => 'error', 'message' => 'Execute error: ' . $stmt->error]);
        exit;
    }

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

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Exception: ' . $e->getMessage()]);
}
?>
