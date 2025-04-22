
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
$requiredFields = ['subject', 'description', 'department', 'area', 'address'];
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
$pincode = isset($data['pincode']) ? sanitizeInput($data['pincode']) : '';
$landmark = isset($data['landmark']) ? sanitizeInput($data['landmark']) : '';

// Generate unique complaint ID (Area-Department-Year-Month-Random5digits)
$complaint_id = strtoupper(substr($area, 0, 3)) . '-' . strtoupper(substr($department, 0, 3)) . '-' . date('Ym') . '-' . rand(10000, 99999);

// Get the appropriate officer ID for this department and area
$officer_id = null;
$officerSql = "SELECT id FROM officers WHERE department = ? AND district = ? LIMIT 1";
$officerStmt = $conn->prepare($officerSql);
$officerStmt->bind_param("ss", $department, $area);
$officerStmt->execute();
$officerStmt->bind_result($officer_id);
$officerStmt->fetch();
$officerStmt->close();

// Prepare SQL statement with landmark field
$sql = "INSERT INTO complaints (complaint_id, citizen_id, subject, description, department, area, address, pincode, landmark, officer_id, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

// Prepare statement
$stmt = $conn->prepare($sql);
$stmt->bind_param("sisssssssi", $complaint_id, $citizen_id, $subject, $description, $department, $area, $address, $pincode, $landmark, $officer_id);

// Execute statement
if ($stmt->execute()) {
    // Handle image upload if exists
    $hasImage = false;
    
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $upload_dir = 'uploads/';
        
        // Create directory if it doesn't exist
        if (!file_exists($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $fileExtension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $newFileName = $complaint_id . '.' . $fileExtension;
        $uploadFile = $upload_dir . $newFileName;
        
        if (move_uploaded_file($_FILES['image']['tmp_name'], $uploadFile)) {
            // Update the complaint with the image path
            $updateSql = "UPDATE complaints SET image_path = ? WHERE complaint_id = ?";
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("ss", $uploadFile, $complaint_id);
            $updateStmt->execute();
            $updateStmt->close();
            $hasImage = true;
        }
    }
    
    // Update the nearby_issues table to track issues by area and department
    $updateAreaIssueSql = "INSERT INTO nearby_issues (area, department, issue_count, last_reported_at)
                          VALUES (?, ?, 1, NOW())
                          ON DUPLICATE KEY UPDATE 
                          issue_count = issue_count + 1, 
                          last_reported_at = NOW(),
                          status = 'Active'";
    
    $updateAreaIssueStmt = $conn->prepare($updateAreaIssueSql);
    $updateAreaIssueStmt->bind_param("ss", $area, $department);
    $updateAreaIssueStmt->execute();
    $updateAreaIssueStmt->close();
    
    echo json_encode([
        'status' => 'success', 
        'message' => 'Complaint submitted successfully',
        'complaint_id' => $complaint_id,
        'has_image' => $hasImage,
        'assigned_to_officer' => $officer_id !== null
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to submit complaint: ' . $stmt->error]);
}

// Close statement and connection
$stmt->close();
$conn->close();
?>
