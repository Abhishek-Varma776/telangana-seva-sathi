
<?php
// Connect to the MySQL server
$servername = "localhost";
$username = "root";
$password = "";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS telangana_seva_sathi";
if ($conn->query($sql) !== TRUE) {
    die("Error creating database: " . $conn->error);
}

// Select the database
$conn->select_db("telangana_seva_sathi");

// Create citizens table
$sql = "CREATE TABLE IF NOT EXISTS citizens (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    aadhar VARCHAR(20) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if ($conn->query($sql) !== TRUE) {
    die("Error creating citizens table: " . $conn->error);
}

// Create officers table
$sql = "CREATE TABLE IF NOT EXISTS officers (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if ($conn->query($sql) !== TRUE) {
    die("Error creating officers table: " . $conn->error);
}

// Create complaints table with additional fields
$sql = "CREATE TABLE IF NOT EXISTS complaints (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    complaint_id VARCHAR(20) NOT NULL UNIQUE,
    citizen_id INT(11) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    department VARCHAR(100) NOT NULL,
    area VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    image_path VARCHAR(255) NULL,
    landmark VARCHAR(255) NULL,
    latitude DECIMAL(10,8) NULL,
    longitude DECIMAL(11,8) NULL,
    status ENUM('Pending', 'In Progress', 'Resolved', 'Closed') NOT NULL DEFAULT 'Pending',
    officer_id INT(11) NULL,
    officer_remarks TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL,
    FOREIGN KEY (citizen_id) REFERENCES citizens(id),
    FOREIGN KEY (officer_id) REFERENCES officers(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if ($conn->query($sql) !== TRUE) {
    die("Error creating complaints table: " . $conn->error);
}

// Create area_issues table to track issues by area
$sql = "CREATE TABLE IF NOT EXISTS area_issues (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    area VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    issue_count INT(11) DEFAULT 0,
    pending_count INT(11) DEFAULT 0,
    in_progress_count INT(11) DEFAULT 0,
    resolved_count INT(11) DEFAULT 0,
    last_reported VARCHAR(50) NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (area, department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if ($conn->query($sql) !== TRUE) {
    die("Error creating area_issues table: " . $conn->error);
}

// Create feedback table
$sql = "CREATE TABLE IF NOT EXISTS feedback (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    complaint_id INT(11) NOT NULL,
    citizen_id INT(11) NOT NULL,
    rating INT(1) NOT NULL,
    comments TEXT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (complaint_id) REFERENCES complaints(id),
    FOREIGN KEY (citizen_id) REFERENCES citizens(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if ($conn->query($sql) !== TRUE) {
    die("Error creating feedback table: " . $conn->error);
}

// Create nearby_issues table for showing issues reported by others in the same area
$sql = "CREATE TABLE IF NOT EXISTS nearby_issues (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    area VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    issue_count INT(11) DEFAULT 1,
    last_reported_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Active', 'Resolved') DEFAULT 'Active',
    UNIQUE KEY (area, department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

if ($conn->query($sql) !== TRUE) {
    die("Error creating nearby_issues table: " . $conn->error);
}

// Insert sample area issues data
$areas = ['Champapet', 'LB Nagar', 'Hayathnagar', 'Nagole', 'Uppal', 'Jubilee Hills', 'Hitech City', 'Raidurg'];
$departments = ['drainage', 'potholes', 'streetlight', 'garbage', 'safety'];

foreach ($areas as $area) {
    foreach ($departments as $department) {
        // Generate random counts
        $issue_count = rand(1, 10);
        $pending_count = rand(0, $issue_count/2);
        $in_progress_count = rand(0, $issue_count/2);
        $resolved_count = $issue_count - $pending_count - $in_progress_count;
        
        // Generate a date within the last month
        $date = date('Y-m-d', strtotime('-' . rand(0, 30) . ' days'));
        
        // Check if record exists
        $checkSql = "SELECT id FROM area_issues WHERE area = ? AND department = ?";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("ss", $area, $department);
        $checkStmt->execute();
        $checkStmt->store_result();
        
        if ($checkStmt->num_rows == 0) {
            // Insert new record
            $insertSql = "INSERT INTO area_issues (area, department, issue_count, pending_count, in_progress_count, resolved_count, last_reported) 
                          VALUES (?, ?, ?, ?, ?, ?, ?)";
            $insertStmt = $conn->prepare($insertSql);
            $insertStmt->bind_param("ssiiiis", $area, $department, $issue_count, $pending_count, $in_progress_count, $resolved_count, $date);
            $insertStmt->execute();
            $insertStmt->close();
        }
        
        $checkStmt->close();
    }
}

// Insert sample officers for each department in each area
$designations = [
    'drainage' => 'Drainage Inspector',
    'potholes' => 'Road Maintenance Officer',
    'streetlight' => 'Electricity Department Officer',
    'garbage' => 'Sanitation Officer',
    'safety' => 'Public Safety Officer'
];

// Function to create a sample password hash
function createSamplePasswordHash() {
    return password_hash('officer123', PASSWORD_DEFAULT);
}

foreach ($areas as $area) {
    foreach ($departments as $department) {
        $name = ucfirst($department) . ' Officer ' . $area;
        $employeeId = strtoupper(substr($department, 0, 3)) . '-' . strtoupper(substr($area, 0, 3)) . '-' . rand(1000, 9999);
        $email = strtolower(str_replace(' ', '.', $department)) . '.' . strtolower(str_replace(' ', '', $area)) . '@telangana.gov.in';
        $phone = '99' . rand(10000000, 99999999);
        $designation = $designations[$department];
        $password = createSamplePasswordHash();
        
        // Check if the officer already exists
        $checkSql = "SELECT id FROM officers WHERE email = ? LIMIT 1";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkStmt->store_result();
        
        if ($checkStmt->num_rows == 0) {
            // Insert the officer
            $insertSql = "INSERT INTO officers (name, employee_id, email, phone, department, designation, district, password) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            $insertStmt = $conn->prepare($insertSql);
            $insertStmt->bind_param("ssssssss", $name, $employeeId, $email, $phone, $department, $designation, $area, $password);
            $insertStmt->execute();
            $insertStmt->close();
        }
        
        $checkStmt->close();
    }
}

// Create uploads directory if it doesn't exist
$upload_dir = __DIR__ . '/uploads';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

echo "Database and tables created successfully. Sample officers and area issues added.";

$conn->close();
?>
