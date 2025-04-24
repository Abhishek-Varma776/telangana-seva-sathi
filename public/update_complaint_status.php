
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

// Check if user is logged in as an officer
session_start();
if (!isset($_SESSION['officer_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Officer not logged in']);
    exit;
}

$officer_id = $_SESSION['officer_id'];

// Get data from request
$data = json_decode(file_get_contents('php://input'), true);

// Check if all required fields are present
$requiredFields = ['complaint_id', 'status'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || empty($data[$field])) {
        echo json_encode(['status' => 'error', 'message' => "Missing required field: $field"]);
        exit;
    }
}

// Sanitize input data
$complaint_id = sanitizeInput($data['complaint_id']);
$status = sanitizeInput($data['status']);
$remarks = isset($data['remarks']) ? sanitizeInput($data['remarks']) : null;

// Validate status
$validStatuses = ['Pending', 'In Progress', 'Resolved', 'Closed'];
if (!in_array($status, $validStatuses)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid status value']);
    exit;
}

// Check if the complaint is assigned to this officer
$checkSql = "SELECT id, department, area FROM complaints WHERE id = ? OR complaint_id = ? AND officer_id = ? LIMIT 1";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("isi", $complaint_id, $complaint_id, $officer_id);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows == 0) {
    echo json_encode(['status' => 'error', 'message' => 'Complaint not found or not assigned to you']);
    $checkStmt->close();
    exit;
}

// Get the department and area for area_issues update
$checkStmt->bind_result($complaintIdNum, $department, $area);
$checkStmt->fetch();
$checkStmt->close();

// Set resolved_at if status is being set to Resolved
$resolvedAt = null;
if ($status === 'Resolved') {
    $resolvedAt = date('Y-m-d H:i:s');
}

// Update complaint status
$updateSql = "UPDATE complaints SET status = ?, officer_remarks = ?, resolved_at = ? WHERE id = ?";
$updateStmt = $conn->prepare($updateSql);
$updateStmt->bind_param("sssi", $status, $remarks, $resolvedAt, $complaintIdNum);

if ($updateStmt->execute()) {
    // Update area_issues table counters
    if ($status === 'Pending' || $status === 'In Progress' || $status === 'Resolved') {
        // Get current status counts
        $areaIssuesSql = "SELECT pending_count, in_progress_count, resolved_count 
                         FROM area_issues 
                         WHERE area = ? AND department = ? 
                         LIMIT 1";
        $areaIssuesStmt = $conn->prepare($areaIssuesSql);
        $areaIssuesStmt->bind_param("ss", $area, $department);
        $areaIssuesStmt->execute();
        $areaIssuesStmt->store_result();
        
        if ($areaIssuesStmt->num_rows > 0) {
            $areaIssuesStmt->bind_result($pendingCount, $inProgressCount, $resolvedCount);
            $areaIssuesStmt->fetch();
            
            // Determine which counters to update based on new status
            $newPendingCount = $pendingCount;
            $newInProgressCount = $inProgressCount;
            $newResolvedCount = $resolvedCount;
            
            if ($status === 'Pending') {
                $newPendingCount++;
                if ($newInProgressCount > 0) $newInProgressCount--;
            } else if ($status === 'In Progress') {
                $newInProgressCount++;
                if ($newPendingCount > 0) $newPendingCount--;
            } else if ($status === 'Resolved') {
                $newResolvedCount++;
                if ($newPendingCount > 0) {
                    $newPendingCount--;
                } else if ($newInProgressCount > 0) {
                    $newInProgressCount--;
                }
            }
            
            // Update area_issues
            $updateAreaIssuesSql = "UPDATE area_issues 
                                   SET pending_count = ?, 
                                       in_progress_count = ?, 
                                       resolved_count = ? 
                                   WHERE area = ? AND department = ?";
            $updateAreaIssuesStmt = $conn->prepare($updateAreaIssuesSql);
            $updateAreaIssuesStmt->bind_param("iiiss", 
                $newPendingCount, 
                $newInProgressCount, 
                $newResolvedCount, 
                $area, 
                $department
            );
            $updateAreaIssuesStmt->execute();
            $updateAreaIssuesStmt->close();
        }
        $areaIssuesStmt->close();
    }
    
    echo json_encode([
        'status' => 'success', 
        'message' => 'Complaint status updated successfully',
        'complaint_id' => $complaint_id,
        'new_status' => $status,
        'resolved_at' => $resolvedAt
    ]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to update complaint status']);
}

$updateStmt->close();
$conn->close();
?>
