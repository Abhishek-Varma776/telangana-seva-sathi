
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IssueReportForm from "@/components/IssueReportForm";
import { Lightbulb } from "lucide-react";

const StreetlightIssue = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-govt-blue text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Lightbulb className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Streetlight Issues</h1>
          <p className="max-w-2xl mx-auto">
            Report non-functioning streetlights, damaged poles, or areas needing new lighting to improve safety and visibility.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-8 bg-govt-lightgray">
        <IssueReportForm issueType="streetlight" issueTitle="Streetlight" />
      </main>
      
      <Footer />
    </div>
  );
};

export default StreetlightIssue;
