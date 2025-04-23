
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IssueReportForm from "@/components/IssueReportForm";
import { Road } from "lucide-react";

const PotholesIssue = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-govt-blue text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Road className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Road & Pothole Issues</h1>
          <p className="max-w-2xl mx-auto">
            Report potholes, road damages, or other road infrastructure issues to help us maintain safe roads for everyone.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-8 bg-govt-lightgray">
        <IssueReportForm issueType="potholes" issueTitle="Pothole" />
      </main>
      
      <Footer />
    </div>
  );
};

export default PotholesIssue;
