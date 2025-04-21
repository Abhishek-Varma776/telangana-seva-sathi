
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import IssueReportForm from "@/components/IssueReportForm";
import { Trash2 } from "lucide-react";

const GarbageIssue = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-govt-blue text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Trash2 className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Garbage Collection Issues</h1>
          <p className="max-w-2xl mx-auto">
            Report uncollected garbage, waste management issues, or need for waste bins to keep our communities clean.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-8 bg-govt-lightgray">
        <IssueReportForm issueType="garbage" issueTitle="Garbage Collection" />
      </main>
      
      <Footer />
    </div>
  );
};

export default GarbageIssue;
