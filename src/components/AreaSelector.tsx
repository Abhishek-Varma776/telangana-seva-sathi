
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";

const AREAS = [
  "Champapet", 
  "LB Nagar", 
  "Hayathnagar", 
  "Nagole", 
  "Uppal", 
  "Jubilee Hills", 
  "Hitech City", 
  "Raidurg"
];

const AreaSelector = () => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState<string>("");

  const handleViewAreaIssues = () => {
    if (selectedArea) {
      navigate(`/area-issues?area=${encodeURIComponent(selectedArea)}`);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="bg-govt-blue text-white">
        <div className="flex items-center space-x-2">
          <MapPin className="h-6 w-6" />
          <CardTitle>Nearby Issues</CardTitle>
        </div>
        <CardDescription className="text-gray-100">
          View issues reported by others in your area
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">Select your area to view reported issues:</p>
            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger>
                <SelectValue placeholder="Select area" />
              </SelectTrigger>
              <SelectContent>
                {AREAS.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button 
            className="w-full bg-govt-orange hover:bg-opacity-90 hover:scale-105 transition-all"
            onClick={handleViewAreaIssues}
            disabled={!selectedArea}
          >
            View Area Issues
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaSelector;
