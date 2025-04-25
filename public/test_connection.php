
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
    
    // Check if citizens table exists and get a sample user
    $citizensTableExists = false;
    $sampleUserEmail = null;
    $result = $conn->query("SHOW TABLES LIKE 'citizens'");
    if ($result->num_rows > 0) {
        $citizensTableExists = true;
        $sampleResult = $conn->query("SELECT email FROM citizens LIMIT 1");
        if ($sampleResult && $row = $sampleResult->fetch_assoc()) {
            $sampleUserEmail = $row['email'];
        }
    }
    
    echo json_encode([
        'status' => 'success',
        'message' => 'Database connection successful',
        'database' => 'telangana_seva_sathi',
        'php_version' => PHP_VERSION,
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'tables' => [
            'officers' => [
                'exists' => $tableExists,
                'count' => $officersCount
            ],
            'citizens' => [
                'exists' => $citizensTableExists,
                'sample_email' => $sampleUserEmail
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
