
<?php
// Include database connection
require_once 'db_connect.php';

// Set header for output
header('Content-Type: text/html; charset=UTF-8');
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telangana Seva Sathi - Database Data</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #f97316;
            text-align: center;
            margin-bottom: 30px;
        }
        h2 {
            color: #1e40af;
            margin-top: 40px;
            border-bottom: 2px solid #1e40af;
            padding-bottom: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        th, td {
            padding: 12px 15px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f2f2f2;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        .back-button {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 15px;
            background-color: #f97316;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .back-button:hover {
            background-color: #ea580c;
        }
        .count-info {
            background-color: #e2e8f0;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Telangana Seva Sathi - Database Data</h1>
        
        <a href="populate_sample_data.php" class="back-button">Generate More Sample Data</a>
        
        <!-- Citizens Table -->
        <h2>Citizens</h2>
        <?php
        $citizensSql = "SELECT COUNT(*) as count FROM citizens";
        $citizensResult = $conn->query($citizensSql);
        $citizensCount = $citizensResult->fetch_assoc()['count'];
        echo "<div class='count-info'>Total Citizens: $citizensCount</div>";
        
        $citizensSql = "SELECT id, name, email, phone, aadhar, district, pincode, created_at FROM citizens";
        $citizensResult = $conn->query($citizensSql);
        
        if ($citizensResult->num_rows > 0) {
            echo "<table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Aadhar</th>
                    <th>District</th>
                    <th>PIN Code</th>
                    <th>Created At</th>
                </tr>";
                
            while($row = $citizensResult->fetch_assoc()) {
                echo "<tr>
                    <td>{$row['id']}</td>
                    <td>{$row['name']}</td>
                    <td>{$row['email']}</td>
                    <td>{$row['phone']}</td>
                    <td>{$row['aadhar']}</td>
                    <td>{$row['district']}</td>
                    <td>{$row['pincode']}</td>
                    <td>{$row['created_at']}</td>
                </tr>";
            }
            echo "</table>";
        } else {
            echo "<p>No citizens found in the database.</p>";
        }
        ?>
        
        <!-- Officers Table -->
        <h2>Officers</h2>
        <?php
        $officersSql = "SELECT COUNT(*) as count FROM officers";
        $officersResult = $conn->query($officersSql);
        $officersCount = $officersResult->fetch_assoc()['count'];
        echo "<div class='count-info'>Total Officers: $officersCount</div>";
        
        $officersSql = "SELECT id, name, employee_id, email, phone, department, designation, district, created_at FROM officers";
        $officersResult = $conn->query($officersSql);
        
        if ($officersResult->num_rows > 0) {
            echo "<table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Employee ID</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Department</th>
                    <th>Designation</th>
                    <th>District</th>
                    <th>Created At</th>
                </tr>";
                
            while($row = $officersResult->fetch_assoc()) {
                echo "<tr>
                    <td>{$row['id']}</td>
                    <td>{$row['name']}</td>
                    <td>{$row['employee_id']}</td>
                    <td>{$row['email']}</td>
                    <td>{$row['phone']}</td>
                    <td>{$row['department']}</td>
                    <td>{$row['designation']}</td>
                    <td>{$row['district']}</td>
                    <td>{$row['created_at']}</td>
                </tr>";
            }
            echo "</table>";
        } else {
            echo "<p>No officers found in the database.</p>";
        }
        ?>
        
        <!-- Complaints Table -->
        <h2>Complaints</h2>
        <?php
        $complaintsSql = "SELECT COUNT(*) as count FROM complaints";
        $complaintsResult = $conn->query($complaintsSql);
        $complaintsCount = $complaintsResult->fetch_assoc()['count'];
        
        $pendingSql = "SELECT COUNT(*) as count FROM complaints WHERE status = 'Pending'";
        $pendingResult = $conn->query($pendingSql);
        $pendingCount = $pendingResult->fetch_assoc()['count'];
        
        $inProgressSql = "SELECT COUNT(*) as count FROM complaints WHERE status = 'In Progress'";
        $inProgressResult = $conn->query($inProgressSql);
        $inProgressCount = $inProgressResult->fetch_assoc()['count'];
        
        $resolvedSql = "SELECT COUNT(*) as count FROM complaints WHERE status = 'Resolved'";
        $resolvedResult = $conn->query($resolvedSql);
        $resolvedCount = $resolvedResult->fetch_assoc()['count'];
        
        echo "<div class='count-info'>
            Total Complaints: $complaintsCount<br>
            Pending: $pendingCount | In Progress: $inProgressCount | Resolved: $resolvedCount
        </div>";
        
        $complaintsSql = "SELECT c.id, c.complaint_id, cit.name as citizen_name, c.subject, c.department, 
                          c.area, c.status, c.created_at, c.resolved_at, c.officer_remarks  
                          FROM complaints c
                          JOIN citizens cit ON c.citizen_id = cit.id
                          ORDER BY c.created_at DESC LIMIT 50";
        $complaintsResult = $conn->query($complaintsSql);
        
        if ($complaintsResult->num_rows > 0) {
            echo "<table>
                <tr>
                    <th>ID</th>
                    <th>Complaint ID</th>
                    <th>Citizen</th>
                    <th>Subject</th>
                    <th>Department</th>
                    <th>Area</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Resolved At</th>
                    <th>Remarks</th>
                </tr>";
                
            while($row = $complaintsResult->fetch_assoc()) {
                $resolvedAt = $row['resolved_at'] ? $row['resolved_at'] : 'Not resolved';
                $remarks = $row['officer_remarks'] ? $row['officer_remarks'] : 'No remarks';
                
                echo "<tr>
                    <td>{$row['id']}</td>
                    <td>{$row['complaint_id']}</td>
                    <td>{$row['citizen_name']}</td>
                    <td>{$row['subject']}</td>
                    <td>{$row['department']}</td>
                    <td>{$row['area']}</td>
                    <td>{$row['status']}</td>
                    <td>{$row['created_at']}</td>
                    <td>$resolvedAt</td>
                    <td>$remarks</td>
                </tr>";
            }
            echo "</table>";
            
            if ($complaintsCount > 50) {
                echo "<p>Showing the 50 most recent complaints out of $complaintsCount total.</p>";
            }
        } else {
            echo "<p>No complaints found in the database.</p>";
        }
        ?>
        
        <!-- Feedback Table -->
        <h2>Feedback</h2>
        <?php
        $feedbackSql = "SELECT COUNT(*) as count FROM feedback";
        $feedbackResult = $conn->query($feedbackSql);
        $feedbackCount = $feedbackResult->fetch_assoc()['count'];
        
        $avgRatingSql = "SELECT AVG(rating) as avg_rating FROM feedback";
        $avgRatingResult = $conn->query($avgRatingSql);
        $avgRating = round($avgRatingResult->fetch_assoc()['avg_rating'], 1);
        
        echo "<div class='count-info'>
            Total Feedback: $feedbackCount | Average Rating: $avgRating/5
        </div>";
        
        $feedbackSql = "SELECT f.id, c.complaint_id, cit.name as citizen_name, f.rating, f.comments, f.created_at 
                         FROM feedback f
                         JOIN complaints c ON f.complaint_id = c.id
                         JOIN citizens cit ON f.citizen_id = cit.id
                         ORDER BY f.created_at DESC";
        $feedbackResult = $conn->query($feedbackSql);
        
        if ($feedbackResult->num_rows > 0) {
            echo "<table>
                <tr>
                    <th>ID</th>
                    <th>Complaint ID</th>
                    <th>Citizen</th>
                    <th>Rating</th>
                    <th>Comments</th>
                    <th>Created At</th>
                </tr>";
                
            while($row = $feedbackResult->fetch_assoc()) {
                echo "<tr>
                    <td>{$row['id']}</td>
                    <td>{$row['complaint_id']}</td>
                    <td>{$row['citizen_name']}</td>
                    <td>{$row['rating']}/5</td>
                    <td>{$row['comments']}</td>
                    <td>{$row['created_at']}</td>
                </tr>";
            }
            echo "</table>";
        } else {
            echo "<p>No feedback found in the database.</p>";
        }
        ?>
        
        <!-- Area Issues Table -->
        <h2>Area Issues</h2>
        <?php
        $areaIssuesSql = "SELECT COUNT(*) as count FROM area_issues";
        $areaIssuesResult = $conn->query($areaIssuesSql);
        $areaIssuesCount = $areaIssuesResult->fetch_assoc()['count'];
        echo "<div class='count-info'>Total Area Issues: $areaIssuesCount</div>";
        
        $areaIssuesSql = "SELECT * FROM area_issues ORDER BY area, department";
        $areaIssuesResult = $conn->query($areaIssuesSql);
        
        if ($areaIssuesResult->num_rows > 0) {
            echo "<table>
                <tr>
                    <th>ID</th>
                    <th>Area</th>
                    <th>Department</th>
                    <th>Issue Count</th>
                    <th>Pending</th>
                    <th>In Progress</th>
                    <th>Resolved</th>
                    <th>Last Reported</th>
                </tr>";
                
            while($row = $areaIssuesResult->fetch_assoc()) {
                echo "<tr>
                    <td>{$row['id']}</td>
                    <td>{$row['area']}</td>
                    <td>{$row['department']}</td>
                    <td>{$row['issue_count']}</td>
                    <td>{$row['pending_count']}</td>
                    <td>{$row['in_progress_count']}</td>
                    <td>{$row['resolved_count']}</td>
                    <td>{$row['last_reported']}</td>
                </tr>";
            }
            echo "</table>";
        } else {
            echo "<p>No area issues found in the database.</p>";
        }
        ?>
        
        <!-- Nearby Issues Table -->
        <h2>Nearby Issues</h2>
        <?php
        $nearbyIssuesSql = "SELECT COUNT(*) as count FROM nearby_issues";
        $nearbyIssuesResult = $conn->query($nearbyIssuesSql);
        $nearbyIssuesCount = $nearbyIssuesResult->fetch_assoc()['count'];
        
        $activeIssuesSql = "SELECT COUNT(*) as count FROM nearby_issues WHERE status = 'Active'";
        $activeIssuesResult = $conn->query($activeIssuesSql);
        $activeIssuesCount = $activeIssuesResult->fetch_assoc()['count'];
        
        $resolvedIssuesSql = "SELECT COUNT(*) as count FROM nearby_issues WHERE status = 'Resolved'";
        $resolvedIssuesResult = $conn->query($resolvedIssuesSql);
        $resolvedIssuesCount = $resolvedIssuesResult->fetch_assoc()['count'];
        
        echo "<div class='count-info'>
            Total Nearby Issues: $nearbyIssuesCount<br>
            Active: $activeIssuesCount | Resolved: $resolvedIssuesCount
        </div>";
        
        $nearbyIssuesSql = "SELECT * FROM nearby_issues ORDER BY area, department";
        $nearbyIssuesResult = $conn->query($nearbyIssuesSql);
        
        if ($nearbyIssuesResult->num_rows > 0) {
            echo "<table>
                <tr>
                    <th>ID</th>
                    <th>Area</th>
                    <th>Department</th>
                    <th>Issue Count</th>
                    <th>Last Reported</th>
                    <th>Status</th>
                </tr>";
                
            while($row = $nearbyIssuesResult->fetch_assoc()) {
                echo "<tr>
                    <td>{$row['id']}</td>
                    <td>{$row['area']}</td>
                    <td>{$row['department']}</td>
                    <td>{$row['issue_count']}</td>
                    <td>{$row['last_reported_at']}</td>
                    <td>{$row['status']}</td>
                </tr>";
            }
            echo "</table>";
        } else {
            echo "<p>No nearby issues found in the database.</p>";
        }
        ?>
    </div>
</body>
</html>

<?php $conn->close(); ?>

