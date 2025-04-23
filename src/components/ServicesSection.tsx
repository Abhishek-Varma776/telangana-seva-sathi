import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Construction,
  Road,
  Lightbulb,
  Trash2,
  Shield,
  Building,
  AlertTriangle,
  HelpCircle,
} from "lucide-react";

interface ServicesSectionProps {
  onIssueSelect?: (issueType: string) => void;
}

// Expanded department services with all required government issues and lucide-react icons
export const departmentServices = [
  {
    title: "Drainage Issues",
    description: "Blockage, overflow, or damage in drainage systems.",
    icon: <Construction className="w-10 h-10 text-govt-blue" />,
    type: "drainage",
  },
  {
    title: "Potholes/Road Damage",
    description: "Potholes or road infrastructure issues.",
    icon: <Construction className="w-10 h-10 text-govt-blue" />,
    type: "potholes",
  },
  {
    title: "Streetlight Problems",
    description: "Non-functioning or damaged streetlights and poles.",
    icon: <Lightbulb className="w-10 h-10 text-govt-blue" />,
    type: "streetlight",
  },
  {
    title: "Garbage Collection",
    description: "Uncollected garbage or need for more waste bins.",
    icon: <Trash2 className="w-10 h-10 text-govt-blue" />,
    type: "garbage",
  },
  {
    title: "Public Safety",
    description: "Safety concerns in public areas, or security issues.",
    icon: <Shield className="w-10 h-10 text-govt-blue" />,
    type: "safety",
  },
  {
    title: "Property/Building Damage",
    description: "Damaged or unsafe public buildings/property.",
    icon: <Building className="w-10 h-10 text-govt-blue" />,
    type: "property-damage",
  },
  {
    title: "Traffic Signals",
    description: "Malfunctioning or missing traffic signals/cones.",
    icon: <AlertTriangle className="w-10 h-10 text-govt-blue" />,
    type: "traffic-signals",
  },
  {
    title: "General Help",
    description: "Other civic, legal, or administrative support.",
    icon: <HelpCircle className="w-10 h-10 text-govt-blue" />,
    type: "general-help",
  },
];

export const departmentNames = {
  drainage: "Drainage",
  potholes: "Road & Potholes",
  streetlight: "Streetlight",
  garbage: "Garbage Collection",
  safety: "Public Safety",
  "property-damage": "Property/Building",
  "traffic-signals": "Traffic Signals",
  "general-help": "Help/Other",
};

const ServicesSection: React.FC<ServicesSectionProps> = ({ onIssueSelect }) => {
  const navigate = useNavigate();

  const handleIssueSelect = (issueType: string) => {
    // Custom handler if provided
    if (onIssueSelect) {
      onIssueSelect(issueType);
      return;
    }
    
    // Otherwise handle navigation directly
    // Check if user is logged in
    const userCheck = sessionStorage.getItem("userType");
    if (!userCheck) {
      toast.error("Please login to report an issue");
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
          {departmentServices.map((service, index) => (
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
