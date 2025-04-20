
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for complaints assigned to this officer
const mockComplaints = [
  {
    id: "C2023-005",
    subject: "Broken streetlight near bus stop",
    department: "Electricity",
    area: "KPHB Colony",
    status: "Pending",
    date: "2023-11-04",
    citizenName: "Ravi Kumar",
    description: "The streetlight near KPHB Phase 3 bus stop is not working for the past week, making the area very dark at night and unsafe.",
    address: "Near Bus Stop, KPHB Phase 3, Hyderabad",
    phone: "9876543210"
  },
  {
    id: "C2023-006",
    subject: "Power fluctuation issue",
    department: "Electricity",
    area: "Miyapur",
    status: "In Progress",
    date: "2023-11-02",
    citizenName: "Anuradha S",
    description: "Severe voltage fluctuation in our area since yesterday. Several appliances have been damaged.",
    address: "Landmark Apartments, Miyapur Main Road, Hyderabad",
    phone: "8765432109"
  },
  {
    id: "C2023-007",
    subject: "Transformer making loud noise",
    department: "Electricity",
    area: "Chandanagar",
    status: "In Progress",
    date: "2023-10-28",
    citizenName: "Mohan Reddy",
    description: "The transformer near our building is making extremely loud noise. We suspect it might be a technical issue that could lead to failure.",
    address: "Sri Sai Enclave, Chandanagar, Hyderabad",
    phone: "7654321098"
  },
  {
    id: "C2023-008",
    subject: "Frequent power cuts",
    department: "Electricity",
    area: "Madhapur",
    status: "Pending",
    date: "2023-11-05",
    citizenName: "Priya Sharma",
    description: "We are experiencing frequent power cuts in our area, almost 3-4 times a day, each lasting 30 minutes to 1 hour.",
    address: "Vivekananda Nagar Colony, Madhapur, Hyderabad",
    phone: "6543210987"
  }
];

const OfficerDashboard = () => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [responseText, setResponseText] = useState("");
  const [updatedStatus, setUpdatedStatus] = useState("");
  
  const handleViewComplaint = (complaint: any) => {
    setSelectedComplaint(complaint);
    setUpdatedStatus(complaint.status);
  };

  const handleStatusChange = (value: string) => {
    setUpdatedStatus(value);
  };

  const handleResponseChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResponseText(e.target.value);
  };

  const handleSubmitResponse = () => {
    console.log("Submitting response for complaint:", selectedComplaint?.id);
    console.log("New status:", updatedStatus);
    console.log("Response:", responseText);
    
    // In a real app, this would send data to backend
    alert("Response submitted successfully!");
    setResponseText("");
    setSelectedComplaint(null);
  };

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

  // Get stats for dashboard
  const pendingCount = mockComplaints.filter(c => c.status === "Pending").length;
  const inProgressCount = mockComplaints.filter(c => c.status === "In Progress").length;
  const resolvedCount = mockComplaints.filter(c => c.status === "Resolved").length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-govt-darkblue text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Officer Dashboard</h1>
          <p>Department: Electricity | District: Hyderabad</p>
        </div>
      </div>
      
      <main className="flex-grow py-8 bg-govt-lightgray">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-govt-blue text-lg">Pending Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{pendingCount}</span>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-govt-blue text-lg">In Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{inProgressCount}</span>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">In Progress</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-govt-blue text-lg">Resolved Complaints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold">{resolvedCount}</span>
                  <Badge className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="assigned-complaints" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="assigned-complaints">Assigned Complaints</TabsTrigger>
              <TabsTrigger value="resolved-complaints">Resolved History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="assigned-complaints" className="space-y-6">
              {selectedComplaint ? (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-govt-blue">Complaint Details</CardTitle>
                      <p className="text-sm text-gray-500">ID: {selectedComplaint.id}</p>
                    </div>
                    <Badge className={getStatusColor(selectedComplaint.status)}>
                      {selectedComplaint.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700">Subject</h4>
                      <p>{selectedComplaint.subject}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700">Description</h4>
                      <p>{selectedComplaint.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-700">Citizen Name</h4>
                        <p>{selectedComplaint.citizenName}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">Contact Number</h4>
                        <p>{selectedComplaint.phone}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700">Location/Address</h4>
                      <p>{selectedComplaint.address}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-700">Area</h4>
                        <p>{selectedComplaint.area}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">Date Filed</h4>
                        <p>{selectedComplaint.date}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-6">
                      <h4 className="font-semibold text-gray-700 mb-3">Update Status</h4>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={updatedStatus}
                            onValueChange={handleStatusChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pending">Pending</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Resolved">Resolved</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="response">Response/Remarks</Label>
                          <Textarea
                            id="response"
                            placeholder="Provide details about the action taken or current status"
                            className="min-h-[120px]"
                            value={responseText}
                            onChange={handleResponseChange}
                          />
                        </div>
                        
                        <div className="flex gap-4">
                          <Button 
                            onClick={handleSubmitResponse}
                            className="bg-govt-blue hover:bg-govt-darkblue"
                          >
                            Submit Response
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => setSelectedComplaint(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-govt-blue">Assigned Complaints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Area</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockComplaints.filter(c => c.status !== "Resolved").map((complaint) => (
                            <TableRow key={complaint.id}>
                              <TableCell className="font-medium">{complaint.id}</TableCell>
                              <TableCell>{complaint.subject}</TableCell>
                              <TableCell>{complaint.area}</TableCell>
                              <TableCell>{complaint.date}</TableCell>
                              <TableCell>
                                <Badge className={getStatusColor(complaint.status)}>
                                  {complaint.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleViewComplaint(complaint)}
                                >
                                  View & Respond
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="resolved-complaints">
              <Card>
                <CardHeader>
                  <CardTitle className="text-govt-blue">Resolved Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Area</TableHead>
                          <TableHead>Date Filed</TableHead>
                          <TableHead>Date Resolved</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {/* In a real app, this would be resolved complaints */}
                        <TableRow>
                          <TableCell className="font-medium">C2023-001</TableCell>
                          <TableCell>Power line repair</TableCell>
                          <TableCell>Jubilee Hills</TableCell>
                          <TableCell>2023-10-25</TableCell>
                          <TableCell>2023-10-28</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">C2023-002</TableCell>
                          <TableCell>Transformer maintenance</TableCell>
                          <TableCell>Banjara Hills</TableCell>
                          <TableCell>2023-10-20</TableCell>
                          <TableCell>2023-10-26</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OfficerDashboard;
