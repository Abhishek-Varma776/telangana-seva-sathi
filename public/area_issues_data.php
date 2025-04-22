
<?php
// This file serves as a basic database for area issues
// In a real implementation, this would be stored in a proper database

$area_issues = [
    "Champapet" => [
        [
            "department" => "drainage",
            "issue_count" => 5,
            "last_reported" => "2025-04-18",
            "pending_count" => 2,
            "in_progress_count" => 2,
            "resolved_count" => 1
        ],
        [
            "department" => "streetlight",
            "issue_count" => 3,
            "last_reported" => "2025-04-15",
            "pending_count" => 1,
            "in_progress_count" => 1,
            "resolved_count" => 1
        ],
        [
            "department" => "garbage",
            "issue_count" => 4,
            "last_reported" => "2025-04-20",
            "pending_count" => 2,
            "in_progress_count" => 1,
            "resolved_count" => 1
        ]
    ],
    "LB Nagar" => [
        [
            "department" => "potholes",
            "issue_count" => 7,
            "last_reported" => "2025-04-19",
            "pending_count" => 3,
            "in_progress_count" => 2,
            "resolved_count" => 2
        ],
        [
            "department" => "drainage",
            "issue_count" => 2,
            "last_reported" => "2025-04-16",
            "pending_count" => 1,
            "in_progress_count" => 0,
            "resolved_count" => 1
        ]
    ],
    "Hayathnagar" => [
        [
            "department" => "safety",
            "issue_count" => 3,
            "last_reported" => "2025-04-17",
            "pending_count" => 1,
            "in_progress_count" => 1,
            "resolved_count" => 1
        ],
        [
            "department" => "streetlight",
            "issue_count" => 4,
            "last_reported" => "2025-04-18",
            "pending_count" => 2,
            "in_progress_count" => 1,
            "resolved_count" => 1
        ]
    ],
    "Nagole" => [
        [
            "department" => "garbage",
            "issue_count" => 6,
            "last_reported" => "2025-04-20",
            "pending_count" => 3,
            "in_progress_count" => 2,
            "resolved_count" => 1
        ]
    ],
    "Uppal" => [
        [
            "department" => "potholes",
            "issue_count" => 8,
            "last_reported" => "2025-04-19",
            "pending_count" => 4,
            "in_progress_count" => 3,
            "resolved_count" => 1
        ],
        [
            "department" => "drainage",
            "issue_count" => 3,
            "last_reported" => "2025-04-15",
            "pending_count" => 2,
            "in_progress_count" => 0,
            "resolved_count" => 1
        ]
    ],
    "Jubilee Hills" => [
        [
            "department" => "streetlight",
            "issue_count" => 2,
            "last_reported" => "2025-04-17",
            "pending_count" => 1,
            "in_progress_count" => 0,
            "resolved_count" => 1
        ]
    ],
    "Hitech City" => [
        [
            "department" => "safety",
            "issue_count" => 2,
            "last_reported" => "2025-04-16",
            "pending_count" => 1,
            "in_progress_count" => 1,
            "resolved_count" => 0
        ]
    ],
    "Raidurg" => [
        [
            "department" => "garbage",
            "issue_count" => 3,
            "last_reported" => "2025-04-18",
            "pending_count" => 2,
            "in_progress_count" => 0,
            "resolved_count" => 1
        ],
        [
            "department" => "potholes",
            "issue_count" => 4,
            "last_reported" => "2025-04-20",
            "pending_count" => 2,
            "in_progress_count" => 1,
            "resolved_count" => 1
        ]
    ]
];

// Function to get issues for a specific area
function getAreaIssues($area) {
    global $area_issues;
    
    if (isset($area_issues[$area])) {
        return $area_issues[$area];
    }
    
    return [];
}

?>
