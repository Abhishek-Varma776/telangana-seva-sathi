
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
$requiredFields = ['complaint_id', 'rating'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(['status' => 'error', 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize input data
$complaint_id = sanitizeInput($data['complaint_id']);
$rating = (int)sanitizeInput($data['rating']);
$comments = isset($data['comments']) ? sanitizeInput($data['comments']) : '';

// Validate rating
if ($rating < 1 || $rating > 5) {
    echo json_encode(['status' => 'error', 'message' => 'Rating must be between 1 and 5']);
    exit;
}

// Get the complaint ID from the database (to ensure it's valid)
$complaintSql = "SELECT id FROM complaints WHERE id = ? AND citizen_id = ? AND status = 'Resolved' LIMIT 1";
$complaintStmt = $conn->prepare($complaintSql);
$complaintStmt->bind_param("ii", $complaint_id, $citizen_id);
$complaintStmt->execute();
$complaintStmt->store_result();

if ($complaintStmt->num_rows == 0) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid complaint ID or complaint is not resolved yet']);
    $complaintStmt->close();
    exit;
}

$complaintStmt->close();

// Check if feedback already exists for this complaint
$checkSql = "SELECT id FROM feedback WHERE complaint_id = ? AND citizen_id = ? LIMIT 1";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("ii", $complaint_id, $citizen_id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    // Update existing feedback
    $updateSql = "UPDATE feedback SET rating = ?, comments = ? WHERE complaint_id = ? AND citizen_id = ?";
    $updateStmt = $conn->prepare($updateSql);
    $updateStmt->bind_param("isii", $rating, $comments, $complaint_id, $citizen_id);
    
    if ($updateStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Feedback updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to update feedback']);
    }
    
    $updateStmt->close();
} else {
    // Insert new feedback
    $insertSql = "INSERT INTO feedback (complaint_id, citizen_id, rating, comments, created_at) 
                 VALUES (?, ?, ?, ?, NOW())";
    $insertStmt = $conn->prepare($insertSql);
    $insertStmt->bind_param("iiis", $complaint_id, $citizen_id, $rating, $comments);
    
    if ($insertStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Feedback submitted successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to submit feedback']);
    }
    
    $insertStmt->close();
}

$checkStmt->close();
$conn->close();
?>
