
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="bg-gradient-to-r from-govt-darkblue to-govt-blue text-white py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-2 font-poppins">
              తెలంగాణ సేవా సాథి
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Telangana Seva Sathi
            </h2>
            <p className="text-xl mb-6">
              A unified platform for citizens to register complaints and for officers to resolve public issues efficiently.
            </p>
            <div className="flex gap-4">
              <Link to="/citizen-login">
                <Button className="bg-govt-orange hover:bg-opacity-90 text-white hover:scale-105 transition-all">
                  Register Complaint
                </Button>
              </Link>
              <Link to="/track-complaint">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-govt-blue hover:scale-105 transition-all">
                  Track Complaint
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <img
              src="/telangana-govt.jpg"
              alt="Telangana Government"
              className="rounded-lg shadow-lg hover:shadow-xl transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
