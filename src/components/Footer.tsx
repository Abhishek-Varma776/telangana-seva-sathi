
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-govt-darkblue text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Telangana Seva Sathi</h3>
            <p className="text-sm">
              A platform for citizens to file and track complaints regarding public services
              and infrastructure in Telangana.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:underline">About Us</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:underline">FAQs</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:underline">Contact Us</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-2 text-sm">
              <li>Address: Telangana Secretariat, Hyderabad</li>
              <li>Email: support@telanganasevasathi.gov.in</li>
              <li>Phone: 040-2345-6789</li>
              <li>Helpline: 1800-123-4567</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-sm text-center">
          <p>© {new Date().getFullYear()} Government of Telangana. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
