import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplet, CircleDashed, Lightbulb, Trash2, ShieldCheck } from "lucide-react";

interface ServicesSectionProps {
  onIssueSelect?: (issueType: string) => void;
}

const services = [
  {
    title: "Drainage Issues",
    description: "Report blockage, overflow or damage in drainage systems across your area.",
    icon: <Droplet className="w-10 h-10 text-govt-blue" />,
    type: "drainage"
  },
  {
    title: "Potholes",
    description: "Report potholes, road damages, or other road infrastructure issues.",
    icon: <CircleDashed className="w-10 h-10 text-govt-blue" />,
    type: "potholes"
  },
  {
    title: "Streetlight",
    description: "Report non-functioning streetlights, damaged poles, or areas needing new lighting.",
    icon: <Lightbulb className="w-10 h-10 text-govt-blue" />,
    type: "streetlight"
  },
  {
    title: "Garbage Collection",
    description: "Report uncollected garbage, waste management issues or need for waste bins.",
    icon: <Trash2 className="w-10 h-10 text-govt-blue" />,
    type: "garbage"
  },
  {
    title: "Public Safety",
    description: "Report safety concerns in public areas, damaged public property or security issues.",
    icon: <ShieldCheck className="w-10 h-10 text-govt-blue" />,
    type: "safety"
  }
];

const ServicesSection: React.FC<ServicesSectionProps> = ({ onIssueSelect }) => {
  const navigate = useNavigate();
  
  const handleIssueSelect = (issueType: string) => {
    // If custom handler provided (e.g., in a different context), use it
    if (onIssueSelect) {
      onIssueSelect(issueType);
      return;
    }
    
    // Otherwise handle navigation directly
    // Check if user is logged in
    const userCheck = sessionStorage.getItem("userType");
    if (!userCheck) {
      toast.error("Please login to report an issue");
      // Store the intended destination to redirect back after login
      sessionStorage.setItem("redirectAfterLogin", `/issue/${issueType}`);
      navigate("/citizen-login");
      return;
    }
    
    // If logged in, navigate directly to issue page
    navigate(`/issue/${issueType}`);
  };

  return (
    <section className="py-16 bg-govt-lightgray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-govt-darkblue font-poppins">
          Report Issues
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="mb-4 flex justify-center">{service.icon}</div>
                <CardTitle className="text-govt-blue text-center">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 mb-4">{service.description}</CardDescription>
                <Button 
                  className="w-full bg-govt-orange hover:bg-opacity-90 hover:scale-105 transition-all"
                  onClick={() => handleIssueSelect(service.type)}
                >
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
