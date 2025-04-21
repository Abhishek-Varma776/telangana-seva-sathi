
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IssueReportForm from "@/components/IssueReportForm";
import { Droplet } from "lucide-react";

const DrainageIssue = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-govt-blue text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Droplet className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Drainage Issues</h1>
          <p className="max-w-2xl mx-auto">
            Report drainage blockages, overflows, or damages. Help us maintain clean and functional drainage systems.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-8 bg-govt-lightgray">
        <IssueReportForm issueType="drainage" issueTitle="Drainage" />
      </main>
      
      <Footer />
    </div>
  );
};

export default DrainageIssue;
