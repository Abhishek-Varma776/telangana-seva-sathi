
<?php
// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "telangana_seva_sathi";

// Set content type to JSON for all responses from this file
header('Content-Type: application/json');

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

// Mock database functions for environments where PHP/MySQL isn't available
function mockDatabaseLogin($email, $password) {
    // Mock user data for testing when database isn't available
    $mockUsers = [
        'test@example.com' => [
            'id' => 1,
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => password_hash('password123', PASSWORD_DEFAULT)
        ],
        'citizen@example.com' => [
            'id' => 2,
            'name' => 'Demo Citizen',
            'email' => 'citizen@example.com',
            'password' => password_hash('citizen123', PASSWORD_DEFAULT)
        ]
    ];
    
    // Check if user exists in mock data
    if (isset($mockUsers[$email])) {
        $user = $mockUsers[$email];
        if (password_verify($password, $user['password'])) {
            return [
                'status' => 'success',
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['name'],
                    'email' => $user['email']
                ]
            ];
        }
    }
    
    return ['status' => 'error', 'message' => 'Invalid credentials'];
}

function mockDatabaseRegister($userData) {
    // In a real scenario, this would validate and save to database
    // For the demo, just return success
    return ['status' => 'success', 'message' => 'Registration successful'];
}

// Success message for direct access
if (basename($_SERVER['PHP_SELF']) === 'db_connect.php') {
    echo json_encode(['status' => 'success', 'message' => 'Database connection successful']);
    exit;
}
// Return connection silently for includes
?>
