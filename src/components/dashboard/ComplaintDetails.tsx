
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Complaint {
  id: string;
  subject: string;
  department: string;
  area: string;
  status: string;
  date: string;
  officerRemarks: string | null;
}

interface ComplaintDetailsProps {
  complaint: Complaint;
  onBack: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800 border-green-200";
    case "In Progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const ComplaintDetails = ({ complaint, onBack }: ComplaintDetailsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-govt-blue">Complaint Details</CardTitle>
          <p className="text-sm text-gray-500">ID: {complaint.id}</p>
        </div>
        <Badge className={getStatusColor(complaint.status)}>
          {complaint.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-700">Subject</h4>
          <p>{complaint.subject}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-gray-700">Department</h4>
            <p>{complaint.department}</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700">Area</h4>
            <p>{complaint.area}</p>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700">Date Filed</h4>
          <p>{complaint.date}</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-700">Officer Remarks</h4>
          <p className="italic">
            {complaint.officerRemarks || "No remarks yet"}
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mt-4"
        >
          Back to List
        </Button>
      </CardContent>
    </Card>
  );
};

export default ComplaintDetails;
