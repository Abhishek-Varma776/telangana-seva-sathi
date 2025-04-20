
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Mock complaint status data
const mockComplaintStatus = {
  id: "C2023-003",
  subject: "Garbage not being collected",
  status: "Pending",
  date: "2023-11-05",
  department: "Municipal",
  area: "Madhapur",
  updates: [
    {
      date: "2023-11-05",
      status: "Submitted",
      remarks: "Complaint registered successfully"
    },
    {
      date: "2023-11-06",
      status: "Assigned",
      remarks: "Assigned to Municipal Officer - Madhapur Zone"
    }
  ]
};

const TrackComplaint = () => {
  const navigate = useNavigate();
  const [complaintId, setComplaintId] = useState("");
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (complaintId.trim() === "") {
      setError("Please enter a valid complaint ID");
      return;
    }
    
    // In a real app, this would make an API call
    // For demo, we'll check against our mock data
    if (complaintId === mockComplaintStatus.id) {
      setTrackingResult(mockComplaintStatus);
    } else {
      setError("No complaint found with this ID. Please check and try again.");
      setTrackingResult(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-govt-blue text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Track Your Complaint</h1>
          <p className="max-w-lg mx-auto">
            Enter your complaint ID to check its current status and updates
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-12 bg-govt-lightgray">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto mb-10">
            <Card>
              <CardHeader>
                <CardTitle className="text-govt-blue">Complaint Tracker</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="complaint-id">Complaint ID</Label>
                    <Input
                      id="complaint-id"
                      placeholder="e.g., C2023-001"
                      value={complaintId}
                      onChange={(e) => setComplaintId(e.target.value)}
                    />
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                  </div>
                  <Button type="submit" className="w-full bg-govt-blue hover:bg-govt-darkblue">
                    Track Complaint
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          {trackingResult && (
            <div className="max-w-xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-govt-blue">
                    Complaint Status
                    <span className={`ml-4 inline-block px-3 py-1 text-sm rounded-full 
                      ${trackingResult.status === "Resolved" ? "bg-green-100 text-green-800" : 
                        trackingResult.status === "In Progress" ? "bg-blue-100 text-blue-800" : 
                        "bg-yellow-100 text-yellow-800"}`}>
                      {trackingResult.status}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Complaint ID</p>
                      <p className="font-medium">{trackingResult.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Filed On</p>
                      <p className="font-medium">{trackingResult.date}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Subject</p>
                    <p className="font-medium">{trackingResult.subject}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium">{trackingResult.department}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Area</p>
                      <p className="font-medium">{trackingResult.area}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold text-gray-700 mb-4">Status Timeline</h3>
                    <div className="relative">
                      {trackingResult.updates.map((update, index) => (
                        <div key={index} className="mb-6 ml-6 relative">
                          {/* Status circle */}
                          <span className="absolute -left-9 h-6 w-6 flex items-center justify-center rounded-full bg-govt-blue text-white">
                            {index + 1}
                          </span>
                          
                          {/* Vertical line */}
                          {index < trackingResult.updates.length - 1 && (
                            <span className="absolute -left-6 h-full w-px bg-gray-300"></span>
                          )}
                          
                          <div className="bg-white rounded-lg p-4 shadow-sm border">
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-semibold">{update.status}</p>
                              <p className="text-xs text-gray-500">{update.date}</p>
                            </div>
                            <p className="text-gray-600 text-sm">{update.remarks}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrackComplaint;
