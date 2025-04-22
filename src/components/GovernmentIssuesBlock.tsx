
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface GovernmentIssue {
  id: string;
  name: string;
  description: string;
}

const fetchGovernmentIssues = async (): Promise<GovernmentIssue[]> => {
  // Simulate fetching from backend database
  if (window.apiConnect && window.apiConnect.fetchApi) {
    // If you have an API like "get_government_issues.php"
    const res = await window.apiConnect.fetchApi("get_government_issues.php");
    if (Array.isArray(res)) return res;
    if (res.issues && Array.isArray(res.issues)) return res.issues;
    // fallback : demo data if API not present
  }
  // Hardcoded fallback data:
  return [
    {
      id: "drainage",
      name: "Drainage Issues",
      description: "Report blockage, overflow or damage in drainage systems."
    },
    {
      id: "potholes",
      name: "Potholes & Road Repair",
      description: "Report road damage, potholes and maintenance needs."
    },
    {
      id: "streetlight",
      name: "Streetlight Problems",
      description: "Report non-functioning streetlights or damaged poles."
    },
    {
      id: "garbage",
      name: "Garbage & Sanitation",
      description: "Report uncollected garbage or sanitation concerns."
    },
    {
      id: "safety",
      name: "Public Safety",
      description: "Report safety concerns, security issues or damaged public property."
    },
    {
      id: "drinking-water",
      name: "Drinking Water",
      description: "Issues related to water supply and quality."
    },
    {
      id: "tax",
      name: "Tax & Bill Payment",
      description: "Issues or queries in paying property tax, water bills etc."
    },
    {
      id: "birth-death",
      name: "Birth/Death Certificates",
      description: "Apply/correct certificates or track their status."
    },
    {
      id: "property-grievance",
      name: "Property Grievance",
      description: "Property ownership disputes or mutations."
    },
    {
      id: "miscellaneous",
      name: "Other Government Issues",
      description: "Miscellaneous grievances not listed above."
    }
  ];
};

interface Props {
  onFileComplaint?: (issueId: string) => void;
}

const GovernmentIssuesBlock: React.FC<Props> = ({ onFileComplaint }) => {
  const [issues, setIssues] = useState<GovernmentIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGovernmentIssues().then(data => {
      setIssues(data);
      setLoading(false);
    });
  }, []);

  const handleFileComplaint = (issue: GovernmentIssue) => {
    if (onFileComplaint) {
      onFileComplaint(issue.id);
      return;
    }
    // Default navigation: go to /issue/:id (if route exists)
    if (issue.id) {
      window.location.href = `/issue/${issue.id}`;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading issues...</div>;
  }

  return (
    <section className="bg-white rounded-lg shadow-lg p-6 my-8 max-w-3xl mx-auto border border-govt-blue">
      <h2 className="text-2xl font-bold mb-4 text-govt-blue text-center">File a Government Complaint</h2>
      <p className="mb-6 text-gray-700 text-center">
        Select any government issue below to register a complaint and resolve your public service grievances:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {issues.map(issue => (
          <Card key={issue.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-govt-blue">{issue.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-gray-600">{issue.description}</div>
              <Button
                className="bg-govt-orange hover:bg-opacity-90 hover:scale-105 transition-all w-full"
                onClick={() => handleFileComplaint(issue)}
              >
                File Complaint
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default GovernmentIssuesBlock;
