
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import ComplaintsList from "@/components/dashboard/ComplaintsList";
import ComplaintDetails from "@/components/dashboard/ComplaintDetails";
import FeedbackForm from "@/components/dashboard/FeedbackForm";
import ComplaintForm from "@/components/dashboard/ComplaintForm";
import ServicesSection from "@/components/ServicesSection";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [issueType, setIssueType] = useState("");
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newComplaint, setNewComplaint] = useState({
    subject: "",
    description: "",
    department: "",
    area: "",
    address: "",
    pincode: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    // Fetch user complaints when component mounts
    fetchUserComplaints();
  }, []);

  const fetchUserComplaints = async () => {
    setLoading(true);
    try {
      const response = await window.apiConnect.getCitizenComplaints();
      if (response.status === "success" && response.complaints) {
        setComplaints(response.complaints);
      } else {
        // Use mock data if API fails
        setComplaints([
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
        ]);
      }
    } catch (err) {
      console.error("Error fetching complaints:", err);
      toast.error("Failed to fetch complaints. Using sample data.");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueSelect = (type: string) => {
    setIssueType(type);
    setNewComplaint({
      ...newComplaint,
      department: type,
    });
    setShowComplaintForm(true);
  };

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

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComplaint.department) {
      toast.error("Please select a department");
      return;
    }
    
    if (!newComplaint.area || !newComplaint.address) {
      toast.error("Please provide location details");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await window.apiConnect.submitComplaint(newComplaint);
      
      if (response.status === "success") {
        toast.success("Complaint submitted successfully!");
        fetchUserComplaints(); // Refresh the complaints list
        setNewComplaint({
          subject: "",
          description: "",
          department: "",
          area: "",
          address: "",
          pincode: "",
        });
        setShowComplaintForm(false);
      } else {
        toast.error(response.message || "Failed to submit complaint");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
          <Tabs defaultValue="services" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="services">Report Issues</TabsTrigger>
              <TabsTrigger value="my-complaints">My Complaints</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services">
              {!showComplaintForm ? (
                <Card>
                  <CardContent className="pt-6">
                    <ServicesSection onIssueSelect={handleIssueSelect} />
                  </CardContent>
                </Card>
              ) : (
                <ComplaintForm
                  newComplaint={{ ...newComplaint }}
                  onInputChange={handleInputChange}
                  onSelectChange={handleSelectChange}
                  onSubmit={handleSubmitComplaint}
                  onCancel={() => setShowComplaintForm(false)}
                  hideFields={issueType ? ["department"] : []}
                />
              )}
            </TabsContent>
            
            <TabsContent value="my-complaints" className="space-y-6">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-xl">Loading complaints...</p>
                </div>
              ) : selectedComplaint ? (
                <ComplaintDetails
                  complaint={selectedComplaint}
                  onBack={() => setSelectedComplaint(null)}
                />
              ) : (
                <ComplaintsList
                  complaints={complaints}
                  onViewComplaint={setSelectedComplaint}
                />
              )}
            </TabsContent>
            
            <TabsContent value="feedback">
              <FeedbackForm complaints={complaints} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CitizenDashboard;
