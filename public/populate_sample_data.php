
<?php
// Include database connection
require_once 'db_connect.php';

// Set header for script output
header('Content-Type: text/html; charset=UTF-8');

// Function to create a sample password hash
function createSamplePasswordHash($password = 'password123') {
    return password_hash($password, PASSWORD_DEFAULT);
}

// Check if database exists, if not redirect to create_database.php
$checkDb = mysqli_select_db($conn, "telangana_seva_sathi");
if (!$checkDb) {
    echo "Database doesn't exist. Please run create_database.php first.";
    exit();
}

// Create sample citizens
$citizens = [
    [
        'name' => 'Rahul Sharma',
        'email' => 'rahul@example.com',
        'phone' => '9876543210',
        'aadhar' => '123456789012',
        'address' => '123 Main Street, Hyderabad',
        'district' => 'Hyderabad',
        'pincode' => '500001',
        'password' => createSamplePasswordHash()
    ],
    [
        'name' => 'Priya Patel',
        'email' => 'priya@example.com',
        'phone' => '8765432109',
        'aadhar' => '234567890123',
        'address' => '456 Park Avenue, Secunderabad',
        'district' => 'Secunderabad',
        'pincode' => '500003',
        'password' => createSamplePasswordHash()
    ],
    [
        'name' => 'Vikram Singh',
        'email' => 'vikram@example.com',
        'phone' => '7654321098',
        'aadhar' => '345678901234',
        'address' => '789 Lake View, Kukatpally',
        'district' => 'Kukatpally',
        'pincode' => '500072',
        'password' => createSamplePasswordHash()
    ],
    [
        'name' => 'Ananya Reddy',
        'email' => 'ananya@example.com',
        'phone' => '6543210987',
        'aadhar' => '456789012345',
        'address' => '234 Hill Top, Jubilee Hills',
        'district' => 'Jubilee Hills',
        'pincode' => '500033',
        'password' => createSamplePasswordHash()
    ]
];

$citizenIds = [];
$insertedCitizens = 0;

foreach ($citizens as $citizen) {
    // Check if citizen already exists
    $checkSql = "SELECT id FROM citizens WHERE email = ? OR aadhar = ? LIMIT 1";
    $checkStmt = $conn->prepare($checkSql);
    $checkStmt->bind_param("ss", $citizen['email'], $citizen['aadhar']);
    $checkStmt->execute();
    $checkStmt->store_result();
    
    if ($checkStmt->num_rows == 0) {
        // Insert citizen
        $insertSql = "INSERT INTO citizens (name, email, phone, aadhar, address, district, pincode, password) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $insertStmt = $conn->prepare($insertSql);
        $insertStmt->bind_param("ssssssss", 
            $citizen['name'], 
            $citizen['email'], 
            $citizen['phone'], 
            $citizen['aadhar'], 
            $citizen['address'], 
            $citizen['district'], 
            $citizen['pincode'], 
            $citizen['password']
        );
        
        if ($insertStmt->execute()) {
            $citizenIds[] = $insertStmt->insert_id;
            $insertedCitizens++;
        }
        $insertStmt->close();
    } else {
        // Get the existing citizen ID
        $checkStmt->bind_result($existingId);
        $checkStmt->fetch();
        $citizenIds[] = $existingId;
    }
    $checkStmt->close();
}

echo "<p>Inserted $insertedCitizens new citizens.</p>";

// Add sample complaints
$areas = ['Champapet', 'LB Nagar', 'Hayathnagar', 'Nagole', 'Uppal', 'Jubilee Hills', 'Hitech City', 'Raidurg'];
$departments = ['drainage', 'potholes', 'streetlight', 'garbage', 'safety'];

$complaints = [];
$complaintSubjects = [
    'drainage' => [
        'Blocked drainage near my house',
        'Water overflow from main drain',
        'Sewage backup in residential area',
        'Drainage pipe damage'
    ],
    'potholes' => [
        'Large pothole on main road',
        'Road damage after heavy rain',
        'Multiple potholes need fixing',
        'Dangerous crack in road surface'
    ],
    'streetlight' => [
        'Streetlight not working for weeks',
        'Broken light pole',
        'Dark street needs more lights',
        'Flickering streetlight'
    ],
    'garbage' => [
        'Garbage not collected for days',
        'Overflowing waste bin',
        'Improper waste disposal',
        'Need additional waste bin'
    ],
    'safety' => [
        'Unsafe construction site',
        'Damaged safety railing',
        'Security concern in public area',
        'Broken traffic signal'
    ]
];

$complaintDescriptions = [
    'drainage' => [
        'The drainage near my house is completely blocked causing water to accumulate during rain.',
        'There is continuous overflow from the main drainage line causing unhygienic conditions.',
        'Sewage is backing up into residential areas creating health hazards.',
        'The drainage pipe is damaged and leaking waste water onto the street.'
    ],
    'potholes' => [
        'There is a very large pothole on the main road that is causing traffic problems.',
        'After recent heavy rains, the road has been severely damaged and needs immediate repair.',
        'Multiple potholes have appeared on our street making it difficult to drive.',
        'There is a dangerous crack running across the road that could cause accidents.'
    ],
    'streetlight' => [
        'The streetlight outside my house hasn\'t been working for several weeks making the area unsafe at night.',
        'A light pole has been damaged and is leaning dangerously.',
        'Our street is very dark at night as there are not enough streetlights.',
        'The streetlight keeps flickering creating visibility issues for drivers.'
    ],
    'garbage' => [
        'The garbage hasn\'t been collected from our area for the past 4 days.',
        'The waste bin on our street is overflowing and causing bad odor.',
        'People are disposing waste improperly near the vacant plot.',
        'We need an additional waste bin in our area as the current one gets filled quickly.'
    ],
    'safety' => [
        'The construction site near the school has no proper barriers posing risk to children.',
        'The safety railing along the bridge is broken and needs immediate repair.',
        'There is a security concern in the public park as many lights are not working.',
        'The traffic signal at the main junction is not working properly causing confusion.'
    ]
];

$insertedComplaints = 0;
$now = date('Y-m-d H:i:s');
$statuses = ['Pending', 'In Progress', 'Resolved'];

// Get officer IDs for assigning complaints
$officerIds = [];
$officerSql = "SELECT id, department, district FROM officers";
$officerResult = $conn->query($officerSql);

if ($officerResult->num_rows > 0) {
    while($row = $officerResult->fetch_assoc()) {
        $key = $row['department'] . '-' . $row['district'];
        $officerIds[$key] = $row['id'];
    }
}

// Generate complaints
foreach ($citizenIds as $citizenId) {
    // Each citizen gets 2-4 complaints
    $numComplaints = rand(2, 4);
    
    for ($i = 0; $i < $numComplaints; $i++) {
        $department = $departments[array_rand($departments)];
        $area = $areas[array_rand($areas)];
        $subject = $complaintSubjects[$department][array_rand($complaintSubjects[$department])];
        $description = $complaintDescriptions[$department][array_rand($complaintDescriptions[$department])];
        $status = $statuses[array_rand($statuses)];
        
        // Generate complaint ID (Area-Dept-YearMonth-Random)
        $complaintId = strtoupper(substr($area, 0, 3)) . '-' . 
                      strtoupper(substr($department, 0, 3)) . '-' . 
                      date('Ym') . '-' . 
                      rand(10000, 99999);
        
        // Set officer ID if available
        $officerId = null;
        $officerKey = $department . '-' . $area;
        if (isset($officerIds[$officerKey])) {
            $officerId = $officerIds[$officerKey];
        }
        
        // Set remarks based on status
        $remarks = null;
        $resolvedAt = null;
        if ($status == 'In Progress') {
            $remarks = "Our team is working on this issue.";
        } else if ($status == 'Resolved') {
            $remarks = "Issue has been fixed. Thank you for reporting.";
            $resolvedAt = date('Y-m-d H:i:s', strtotime('-' . rand(1, 10) . ' days'));
        }
        
        // Insert complaint
        $checkSql = "SELECT id FROM complaints WHERE complaint_id = ? LIMIT 1";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("s", $complaintId);
        $checkStmt->execute();
        $checkStmt->store_result();
        
        if ($checkStmt->num_rows == 0) {
            $insertSql = "INSERT INTO complaints 
                (complaint_id, citizen_id, subject, description, department, area, address, pincode, 
                status, officer_id, officer_remarks, created_at, resolved_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                
            $insertStmt = $conn->prepare($insertSql);
            $address = "Sample address in $area";
            $pincode = "5000" . rand(10, 99);
            
            $insertStmt->bind_param("sisssssssisss", 
                $complaintId,
                $citizenId,
                $subject,
                $description,
                $department,
                $area,
                $address,
                $pincode,
                $status,
                $officerId,
                $remarks,
                $now,
                $resolvedAt
            );
            
            if ($insertStmt->execute()) {
                $insertedComplaints++;
                
                // Update area_issues table
                $updateSql = "INSERT INTO area_issues 
                    (area, department, issue_count, pending_count, in_progress_count, resolved_count, last_reported) 
                    VALUES (?, ?, 1, ?, ?, ?, NOW())
                    ON DUPLICATE KEY UPDATE 
                    issue_count = issue_count + 1,
                    pending_count = pending_count + ?,
                    in_progress_count = in_progress_count + ?,
                    resolved_count = resolved_count + ?,
                    last_reported = NOW()";
                    
                $pendingCount = $status == 'Pending' ? 1 : 0;
                $inProgressCount = $status == 'In Progress' ? 1 : 0;
                $resolvedCount = $status == 'Resolved' ? 1 : 0;
                
                $updateStmt = $conn->prepare($updateSql);
                $updateStmt->bind_param("ssiiiiii", 
                    $area, 
                    $department, 
                    $pendingCount,
                    $inProgressCount,
                    $resolvedCount,
                    $pendingCount,
                    $inProgressCount,
                    $resolvedCount
                );
                $updateStmt->execute();
                $updateStmt->close();
            }
            $insertStmt->close();
        }
        $checkStmt->close();
    }
}

echo "<p>Inserted $insertedComplaints new complaints.</p>";

// Add feedback for resolved complaints
$feedbackComments = [
    "The issue was resolved quickly. Thank you!",
    "Good service, but took longer than expected.",
    "Very satisfied with the resolution.",
    "Problem fixed but communication could be better.",
    "Excellent service and quick resolution."
];

$insertedFeedback = 0;

// Get resolved complaints
$resolvedSql = "SELECT id, citizen_id FROM complaints WHERE status = 'Resolved'";
$resolvedResult = $conn->query($resolvedSql);

if ($resolvedResult->num_rows > 0) {
    while($row = $resolvedResult->fetch_assoc()) {
        // 80% chance of giving feedback
        if (rand(1, 100) <= 80) {
            $complaintId = $row['id'];
            $citizenId = $row['citizen_id'];
            $rating = rand(3, 5); // Mostly positive ratings
            $comment = $feedbackComments[array_rand($feedbackComments)];
            
            $checkSql = "SELECT id FROM feedback WHERE complaint_id = ? AND citizen_id = ? LIMIT 1";
            $checkStmt = $conn->prepare($checkSql);
            $checkStmt->bind_param("ii", $complaintId, $citizenId);
            $checkStmt->execute();
            $checkStmt->store_result();
            
            if ($checkStmt->num_rows == 0) {
                $insertSql = "INSERT INTO feedback (complaint_id, citizen_id, rating, comments, created_at) 
                             VALUES (?, ?, ?, ?, NOW())";
                $insertStmt = $conn->prepare($insertSql);
                $insertStmt->bind_param("iiis", $complaintId, $citizenId, $rating, $comment);
                
                if ($insertStmt->execute()) {
                    $insertedFeedback++;
                }
                $insertStmt->close();
            }
            $checkStmt->close();
        }
    }
}

echo "<p>Inserted $insertedFeedback new feedback entries.</p>";

// Add nearby issues data
$insertedNearbyIssues = 0;

foreach ($areas as $area) {
    foreach ($departments as $department) {
        $issueCount = rand(1, 15);
        $lastReported = date('Y-m-d H:i:s', strtotime('-' . rand(1, 30) . ' days'));
        $status = rand(0, 100) > 30 ? 'Active' : 'Resolved'; // 70% active, 30% resolved
        
        $checkSql = "SELECT id FROM nearby_issues WHERE area = ? AND department = ? LIMIT 1";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bind_param("ss", $area, $department);
        $checkStmt->execute();
        $checkStmt->store_result();
        
        if ($checkStmt->num_rows == 0) {
            $insertSql = "INSERT INTO nearby_issues (area, department, issue_count, last_reported_at, status) 
                         VALUES (?, ?, ?, ?, ?)";
            $insertStmt = $conn->prepare($insertSql);
            $insertStmt->bind_param("ssiss", $area, $department, $issueCount, $lastReported, $status);
            
            if ($insertStmt->execute()) {
                $insertedNearbyIssues++;
            }
            $insertStmt->close();
        }
        $checkStmt->close();
    }
}

echo "<p>Inserted $insertedNearbyIssues new nearby issues.</p>";

echo "<div style='margin-top: 30px;'>
    <a href='view_data.php' style='padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;'>
        View All Data
    </a>
</div>";

$conn->close();
?>
