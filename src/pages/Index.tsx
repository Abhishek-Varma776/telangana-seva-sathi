import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AreaSelector from "@/components/AreaSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import NewComplaintBlock from "@/components/NewComplaintBlock";

const Index = () => {
  const stats = [
    { value: "95%", label: "Resolution Rate" },
    { value: "7 Days", label: "Average Resolution Time" },
    { value: "24/7", label: "Support Available" },
    { value: "50+", label: "Government Departments" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        
        <NewComplaintBlock />

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4 text-govt-darkblue font-poppins">
              How It Works
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              తెలంగాణ సేవా సాథి provides a simple and efficient way for citizens to register complaints
              and for officers to resolve them within 7 working days.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-govt-lightblue text-white text-2xl font-bold rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">1</div>
                <h3 className="text-xl font-semibold mb-2 text-govt-blue">Register</h3>
                <p className="text-gray-600">Create an account as a citizen or login as an officer.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-govt-lightblue text-white text-2xl font-bold rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">2</div>
                <h3 className="text-xl font-semibold mb-2 text-govt-blue">Submit</h3>
                <p className="text-gray-600">File a complaint with necessary details and supporting documents.</p>
              </div>
              
              <div className="text-center">
                <div className="bg-govt-lightblue text-white text-2xl font-bold rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">3</div>
                <h3 className="text-xl font-semibold mb-2 text-govt-blue">Track</h3>
                <p className="text-gray-600">Monitor the status of your complaint and receive updates from officers.</p>
              </div>
            </div>
          </div>
        </section>
        
        <ServicesSection />

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto">
              <AreaSelector />
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-govt-blue text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8 text-govt-darkblue font-poppins">
              Join Telangana Seva Sathi
            </h2>
            
            <div className="flex flex-col md:flex-row gap-8 justify-center">
              <Card className="w-full md:w-96">
                <CardHeader>
                  <CardTitle className="text-govt-blue text-2xl">For Citizens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Register and file complaints about public services in your area.</p>
                  <Link to="/citizen-register">
                    <Button className="w-full bg-govt-orange hover:bg-opacity-90 hover:scale-105 transition-all">Register as Citizen</Button>
                  </Link>
                  <p className="text-sm text-gray-500">Already registered?{" "}
                    <Link to="/citizen-login" className="text-govt-blue hover:underline">Login here</Link>
                  </p>
                </CardContent>
              </Card>
              
              <Card className="w-full md:w-96">
                <CardHeader>
                  <CardTitle className="text-govt-blue text-2xl">For Officers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">Access and resolve complaints assigned to your department.</p>
                  <Link to="/officer-register">
                    <Button className="w-full bg-govt-orange hover:bg-opacity-90 hover:scale-105 transition-all">Register as Officer</Button>
                  </Link>
                  <p className="text-sm text-gray-500">Already registered?{" "}
                    <Link to="/officer-login" className="text-govt-blue hover:underline">Login here</Link>
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
