
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="bg-govt-darkblue text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <img src="/telangana-logo.png" alt="Telangana Logo" className="h-12 w-auto" />
            <div>
              <h1 className="text-xl font-bold font-poppins">तेलंगाना सेवा साथी</h1>
              <p className="text-sm">Telangana Seva Sathi</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/citizen-login">
              <Button variant="outline" className="text-white border-white hover:bg-govt-blue">
                Citizen Login
              </Button>
            </Link>
            <Link to="/officer-login">
              <Button variant="outline" className="text-white border-white hover:bg-govt-blue">
                Officer Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
