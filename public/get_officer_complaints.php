
<?php
// Include database connection
require_once 'db_connect.php';

// Set header to accept JSON requests
header('Content-Type: application/json');

// Start session
session_start();

// Check if user is logged in as an officer
if (!isset($_SESSION['officer_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Officer not logged in']);
    exit;
}

$officer_id = $_SESSION['officer_id'];

// Get filter parameters
$status = isset($_GET['status']) ? sanitizeInput($_GET['status']) : null;
$area = isset($_GET['area']) ? sanitizeInput($_GET['area']) : null;
$department = isset($_GET['department']) ? sanitizeInput($_GET['department']) : null;

// Prepare SQL statement to get complaints assigned to the officer
$sql = "SELECT 
            c.id, 
            c.complaint_id, 
            c.subject, 
            c.description, 
            c.department, 
            c.area, 
            c.address, 
            c.pincode, 
            c.status, 
            c.created_at, 
            c.resolved_at, 
            c.officer_remarks,
            c.landmark,
            c.image_path,
            cit.name as citizen_name,
            cit.phone as citizen_phone
        FROM complaints c
        JOIN citizens cit ON c.citizen_id = cit.id
        WHERE c.officer_id = ?";

// Add filters if provided
if ($status) {
    $sql .= " AND c.status = ?";
}
if ($area) {
    $sql .= " AND c.area = ?";
}
if ($department) {
    $sql .= " AND c.department = ?";
}

$sql .= " ORDER BY c.created_at DESC";

// Prepare statement with dynamic binding
$stmt = $conn->prepare($sql);

// Create binding parameters array
$bindTypes = "i"; // officer_id is integer
$bindParams = [$officer_id];

// Add additional binding parameters if filters are used
if ($status) {
    $bindTypes .= "s";
    $bindParams[] = $status;
}
if ($area) {
    $bindTypes .= "s";
    $bindParams[] = $area;
}
if ($department) {
    $bindTypes .= "s";
    $bindParams[] = $department;
}

// Dynamically bind parameters
$stmt->bind_param($bindTypes, ...$bindParams);

// Execute statement
$stmt->execute();
$result = $stmt->get_result();

$complaints = [];

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        // Format date in a readable format
        $createdDate = date('Y-m-d', strtotime($row['created_at']));
        $resolvedDate = $row['resolved_at'] ? date('Y-m-d', strtotime($row['resolved_at'])) : null;
        
        // Add image URL if image exists
        $imageUrl = null;
        if ($row['image_path']) {
            // Get the host URL
            $host = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https://" : "http://") . $_SERVER['HTTP_HOST'];
            $imageUrl = $host . '/' . $row['image_path'];
        }
        
        // Add complaint to array
        $complaints[] = [
            'id' => $row['id'],
            'complaintId' => $row['complaint_id'],
            'subject' => $row['subject'],
            'description' => $row['description'],
            'department' => $row['department'],
            'area' => $row['area'],
            'address' => $row['address'],
            'pincode' => $row['pincode'],
            'status' => $row['status'],
            'date' => $createdDate,
            'createdAt' => $row['created_at'],
            'resolvedAt' => $resolvedDate,
            'officerRemarks' => $row['officer_remarks'],
            'landmark' => $row['landmark'],
            'imageUrl' => $imageUrl,
            'citizen' => [
                'name' => $row['citizen_name'],
                'phone' => $row['citizen_phone']
            ]
        ];
    }
}

// Return complaints in JSON format
echo json_encode([
    'status' => 'success',
    'complaints' => $complaints,
    'count' => count($complaints),
    'filters' => [
        'status' => $status,
        'area' => $area,
        'department' => $department
    ]
]);

// Close statement and connection
$stmt->close();
$conn->close();
?>

