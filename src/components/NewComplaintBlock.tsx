
import React from "react";
import { departmentServices } from "@/components/ServicesSection";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NewComplaintBlock: React.FC = () => {
  const navigate = useNavigate();

  // When user clicks, check login and navigate accordingly
  const handleNewComplaint = () => {
    const userType = sessionStorage.getItem("userType");
    if (userType) {
      navigate("/citizen-dashboard"); // Or to direct form if preferred
    } else {
      navigate("/citizen-login");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 my-8 max-w-2xl mx-auto border border-govt-blue">
      <h2 className="text-2xl font-bold mb-4 text-govt-blue text-center">File a New Complaint</h2>
      <p className="mb-4 text-gray-700 text-center">
        Select a department and register public issues in your area.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {departmentServices.map((dept, i) => (
          <div key={i} className="flex items-center gap-3 bg-govt-lightgray rounded px-3 py-2">
            <span>{dept.icon}</span>
            <span className="font-medium">{dept.title}</span>
          </div>
        ))}
      </div>
      <div className="text-center">
        <Button 
          className="bg-govt-orange hover:bg-opacity-90 hover:scale-105 transition-all min-w-40"
          onClick={handleNewComplaint}
        >
          File New Complaint
        </Button>
      </div>
    </div>
  );
};

export default NewComplaintBlock;
