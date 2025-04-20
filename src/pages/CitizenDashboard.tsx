
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// Mock data for complaints
const mockComplaints = [
  {
    id: "C2023-001",
    subject: "Water leakage in main pipeline",
    department: "Water Board",
    area: "Kukatpally",
    status: "Resolved",
    date: "2023-10-15",
    officerRemarks: "Fixed the pipe leak and restored water supply"
  },
  {
    id: "C2023-002",
    subject: "Street light not working",
    department: "Electricity",
    area: "Ameerpet",
    status: "In Progress",
    date: "2023-11-02",
    officerRemarks: "Team dispatched for repair"
  },
  {
    id: "C2023-003",
    subject: "Garbage not being collected",
    department: "Municipal",
    area: "Madhapur",
    status: "Pending",
    date: "2023-11-05",
    officerRemarks: null
  },
  {
    id: "C2023-004",
    subject: "Pothole on main road",
    department: "Municipal",
    area: "Hitech City",
    status: "In Progress",
    date: "2023-11-01",
    officerRemarks: "Scheduled for repair next week"
  },
];

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [newComplaint, setNewComplaint] = useState({
    subject: "",
    description: "",
    department: "",
    area: "",
    address: "",
    pincode: "",
  });
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewComplaint({
      ...newComplaint,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewComplaint({
      ...newComplaint,
      [name]: value,
    });
  };

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting complaint:", newComplaint);
    // In a real app, this would send the data to backend
    alert("Complaint submitted successfully!");
    setNewComplaint({
      subject: "",
      description: "",
      department: "",
      area: "",
      address: "",
      pincode: "",
    });
  };

  const handleViewComplaint = (complaint: any) => {
    setSelectedComplaint(complaint);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-govt-blue text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold">Citizen Dashboard</h1>
          <p>Welcome back, Citizen</p>
        </div>
      </div>
      
      <main className="flex-grow py-8 bg-govt-lightgray">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="file-complaint" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="file-complaint">File a Complaint</TabsTrigger>
              <TabsTrigger value="my-complaints">My Complaints</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="file-complaint">
              <Card>
                <CardHeader>
                  <CardTitle className="text-govt-blue">File a New Complaint</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitComplaint} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="Brief subject of your complaint"
                        value={newComplaint.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Detailed Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Provide detailed information about the issue"
                        value={newComplaint.description}
                        onChange={handleInputChange}
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          onValueChange={(value) => handleSelectChange("department", value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="municipal">Municipal Administration</SelectItem>
                            <SelectItem value="water">Water Board</SelectItem>
                            <SelectItem value="electricity">Electricity Department</SelectItem>
                            <SelectItem value="transport">Transport Department</SelectItem>
                            <SelectItem value="health">Health Department</SelectItem>
                            <SelectItem value="education">Education Department</SelectItem>
                            <SelectItem value="panchayat">Panchayat Raj</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="area">Area/Colony</Label>
                        <Input
                          id="area"
                          name="area"
                          placeholder="Your area or colony name"
                          value={newComplaint.area}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Complete Address</Label>
                      <Textarea
                        id="address"
                        name="address"
                        placeholder="Full address where the issue is located"
                        value={newComplaint.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        placeholder="6-digit PIN code"
                        value={newComplaint.pincode}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button type="submit" className="bg-govt-orange hover:bg-opacity-90">
                        Submit Complaint
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="my-complaints" className="space-y-6">
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
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-700">Department</h4>
                        <p>{selectedComplaint.department}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-700">Area</h4>
                        <p>{selectedComplaint.area}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Date Filed</h4>
                      <p>{selectedComplaint.date}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700">Officer Remarks</h4>
                      <p className="italic">
                        {selectedComplaint.officerRemarks || "No remarks yet"}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedComplaint(null)}
                      className="mt-4"
                    >
                      Back to List
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-govt-blue">My Complaints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockComplaints.map((complaint) => (
                            <TableRow key={complaint.id}>
                              <TableCell className="font-medium">{complaint.id}</TableCell>
                              <TableCell>{complaint.subject}</TableCell>
                              <TableCell>{complaint.department}</TableCell>
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
                                  View
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
            
            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle className="text-govt-blue">Provide Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="complaint-id">Complaint ID</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select complaint" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockComplaints.map(complaint => (
                            <SelectItem key={complaint.id} value={complaint.id}>
                              {complaint.id} - {complaint.subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating</Label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Rate your experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">Excellent</SelectItem>
                          <SelectItem value="4">Good</SelectItem>
                          <SelectItem value="3">Average</SelectItem>
                          <SelectItem value="2">Below Average</SelectItem>
                          <SelectItem value="1">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="feedback">Detailed Feedback</Label>
                      <Textarea
                        id="feedback"
                        placeholder="Share your experience with how your complaint was handled"
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button className="bg-govt-blue hover:bg-govt-darkblue">
                        Submit Feedback
                      </Button>
                    </div>
                  </form>
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

export default CitizenDashboard;
