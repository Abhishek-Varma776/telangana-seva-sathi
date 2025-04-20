
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

// Check if user is logged in
session_start();
if (!isset($_SESSION['citizen_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

$citizen_id = $_SESSION['citizen_id'];

// Get data from request
$data = json_decode(file_get_contents('php://input'), true);

// Check if all required fields are present
$requiredFields = ['subject', 'description', 'department', 'area', 'address', 'pincode'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(['status' => 'error', 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize input data
$subject = sanitizeInput($data['subject']);
$description = sanitizeInput($data['description']);
$department = sanitizeInput($data['department']);
$area = sanitizeInput($data['area']);
$address = sanitizeInput($data['address']);
$pincode = sanitizeInput($data['pincode']);

// Generate unique complaint ID (Year-Month-Random5digits)
$complaint_id = 'TS-' . date('Ym') . '-' . rand(10000, 99999);

// Prepare SQL statement
$sql = "INSERT INTO complaints (complaint_id, citizen_id, subject, description, department, area, address, pincode, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())";

// Prepare statement
$stmt = $conn->prepare($sql);
$stmt->bind_param("sissssss", $complaint_id, $citizen_id, $subject, $description, $department, $area, $address, $pincode);

// Execute statement
if ($stmt->execute()) {
    echo json_encode([
        'status' => 'success', 
        'message' => 'Complaint submitted successfully',
        'complaint_id' => $complaint_id
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to submit complaint: ' . $stmt->error]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
