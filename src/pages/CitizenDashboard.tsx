import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ComplaintForm from "@/components/dashboard/ComplaintForm";
import ComplaintsList from "@/components/dashboard/ComplaintsList";
import ComplaintDetails from "@/components/dashboard/ComplaintDetails";
import FeedbackForm from "@/components/dashboard/FeedbackForm";
import ServicesSection from "@/components/ServicesSection";
import { Card, CardContent } from "@/components/ui/card";

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
          <Tabs defaultValue="services" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="services">Report Issues</TabsTrigger>
              <TabsTrigger value="file-complaint">File a Complaint</TabsTrigger>
              <TabsTrigger value="my-complaints">My Complaints</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services">
              <Card>
                <CardContent className="pt-6">
                  <ServicesSection />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="file-complaint">
              <ComplaintForm
                newComplaint={newComplaint}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
                onSubmit={handleSubmitComplaint}
              />
            </TabsContent>
            
            <TabsContent value="my-complaints" className="space-y-6">
              {selectedComplaint ? (
                <ComplaintDetails
                  complaint={selectedComplaint}
                  onBack={() => setSelectedComplaint(null)}
                />
              ) : (
                <ComplaintsList
                  complaints={mockComplaints}
                  onViewComplaint={setSelectedComplaint}
                />
              )}
            </TabsContent>
            
            <TabsContent value="feedback">
              <FeedbackForm complaints={mockComplaints} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CitizenDashboard;
