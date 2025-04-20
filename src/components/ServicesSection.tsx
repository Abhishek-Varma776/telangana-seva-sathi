
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const services = [
  {
    title: "Municipal Issues",
    description: "Report issues related to roads, drainage, streetlights, garbage collection, etc.",
    icon: "🏙️"
  },
  {
    title: "Water Supply",
    description: "Report problems related to water supply, leakages, and water quality issues.",
    icon: "💧"
  },
  {
    title: "Electricity",
    description: "File complaints regarding power outages, voltage issues, or damaged electrical infrastructure.",
    icon: "⚡"
  },
  {
    title: "Public Transport",
    description: "Report issues with public transportation services, bus stops, and related infrastructure.",
    icon: "🚌"
  },
  {
    title: "Health & Sanitation",
    description: "Raise concerns about public health facilities and sanitation issues in your area.",
    icon: "🏥"
  },
  {
    title: "Education",
    description: "Report issues related to government educational institutions and facilities.",
    icon: "🎓"
  }
];

const ServicesSection = () => {
  return (
    <section className="py-16 bg-govt-lightgray">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-govt-darkblue font-poppins">
          Our Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="text-4xl mb-4">{service.icon}</div>
                <CardTitle className="text-govt-blue">{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
