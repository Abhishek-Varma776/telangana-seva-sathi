
<?php
// Include database connection
require_once 'db_connect.php';

// Set header to accept JSON requests
header('Content-Type: application/json');

// Start session
session_start();

// Check if user is logged in
if (!isset($_SESSION['citizen_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in']);
    exit;
}

$citizen_id = $_SESSION['citizen_id'];

// Prepare SQL statement to get complaints for the logged in citizen
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
            o.name as officer_name,
            o.designation as officer_designation,
            o.phone as officer_phone
        FROM complaints c
        LEFT JOIN officers o ON c.officer_id = o.id
        WHERE c.citizen_id = ?
        ORDER BY c.created_at DESC";

// Prepare statement
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $citizen_id);

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
            'officer' => [
                'name' => $row['officer_name'],
                'designation' => $row['officer_designation'],
                'phone' => $row['officer_phone']
            ]
        ];
    }
}

// Return complaints in JSON format
echo json_encode([
    'status' => 'success',
    'complaints' => $complaints,
    'count' => count($complaints)
]);

// Close statement and connection
$stmt->close();
$conn->close();
?>

