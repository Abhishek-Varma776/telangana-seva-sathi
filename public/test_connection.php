
<?php
// Test file to verify database connection
header('Content-Type: application/json');

try {
    // Include database connection
    require_once 'db_connect.php';
    
    // Check connection
    if ($conn->connect_error) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Database connection failed: ' . $conn->connect_error
        ]);
        exit;
    }
    
    // Test query - check if officers table exists
    $result = $conn->query("SHOW TABLES LIKE 'officers'");
    $tableExists = ($result->num_rows > 0);
    
    // Test query - count officers
    $officersCount = 0;
    if ($tableExists) {
        $countResult = $conn->query("SELECT COUNT(*) as count FROM officers");
        if ($countResult && $row = $countResult->fetch_assoc()) {
            $officersCount = $row['count'];
        }
    }
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Database connection successful',
        'database' => 'telangana_seva_sathi',
        'tables' => [
            'officers' => [
                'exists' => $tableExists,
                'count' => $officersCount
            ]
        ]
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Exception: ' . $e->getMessage()
    ]);
}

// Close connection
if (isset($conn)) {
    $conn->close();
}
?>
