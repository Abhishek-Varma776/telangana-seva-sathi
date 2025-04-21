
<?php
// Include database connection
require_once 'db_connect.php';

// Set header to accept JSON requests
header('Content-Type: application/json');

// Check if request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}

// Get area parameter
if (!isset($_GET['area'])) {
    echo json_encode(['status' => 'error', 'message' => 'Area parameter is required']);
    exit;
}

$area = sanitizeInput($_GET['area']);

// Get issues for the specified area
$sql = "SELECT c.department, COUNT(*) as issue_count, 
        MAX(c.created_at) as last_reported, 
        SUM(CASE WHEN c.status = 'Pending' THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN c.status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_count,
        SUM(CASE WHEN c.status = 'Resolved' THEN 1 ELSE 0 END) as resolved_count
        FROM complaints c
        WHERE c.area = ?
        GROUP BY c.department";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $area);
$stmt->execute();
$result = $stmt->get_result();

$issues = [];
while ($row = $result->fetch_assoc()) {
    $issues[] = [
        'department' => $row['department'],
        'issue_count' => (int)$row['issue_count'],
        'last_reported' => $row['last_reported'],
        'pending_count' => (int)$row['pending_count'],
        'in_progress_count' => (int)$row['in_progress_count'],
        'resolved_count' => (int)$row['resolved_count']
    ];
}

echo json_encode([
    'status' => 'success',
    'area' => $area,
    'issues' => $issues
]);

// Close statement and connection
$stmt->close();
$conn->close();
?>
