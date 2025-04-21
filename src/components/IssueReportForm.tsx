
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Upload, Camera } from "lucide-react";

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

interface IssueReportFormProps {
  issueType: string;
  issueTitle: string;
}

const IssueReportForm: React.FC<IssueReportFormProps> = ({ issueType, issueTitle }) => {
  const navigate = useNavigate();
  const [selectedArea, setSelectedArea] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedArea) {
      toast.error("Please select an area");
      return;
    }

    if (!description) {
      toast.error("Please provide a description");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Check if user is logged in
      const userCheck = sessionStorage.getItem("userType");
      if (!userCheck) {
        toast.error("Please login to report an issue");
        navigate("/citizen-login");
        return;
      }
      
      // Prepare form data for submission
      const formData = new FormData();
      formData.append("issue_type", issueType);
      formData.append("area", selectedArea);
      formData.append("description", description);
      formData.append("landmark", landmark);
      if (image) {
        formData.append("image", image);
      }
      
      // Submit the complaint through the API bridge
      const complaintData = {
        subject: `${issueType} issue in ${selectedArea}`,
        description: description,
        department: issueType,
        area: selectedArea,
        address: landmark,
        pincode: "500000" // Default pincode, should be made dynamic in a real system
      };

      const response = await window.apiConnect.submitComplaint(complaintData);
      
      if (response.status === "success") {
        toast.success("Issue reported successfully!");
        navigate(`/track-complaint?id=${response.complaint_id}`);
      } else {
        toast.error(response.message || "Failed to report issue. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="bg-govt-blue text-white">
          <CardTitle className="text-2xl">Report {issueTitle} Issue</CardTitle>
          <CardDescription className="text-gray-100">
            Please provide details about the issue
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="area">Select Area</Label>
              <Select value={selectedArea} onValueChange={setSelectedArea}>
                <SelectTrigger id="area">
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                placeholder="Describe the issue in detail" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="landmark">Landmark or Exact Location</Label>
              <div className="flex gap-3">
                <Input 
                  id="landmark" 
                  placeholder="Enter a landmark or location details"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  className="flex-grow"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => toast.info("Map integration coming soon!")}
                >
                  <MapPin size={16} />
                  <span>Map</span>
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Input 
                    id="image" 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('image')?.click()} 
                    className="flex items-center gap-2"
                  >
                    <Upload size={16} />
                    <span>Choose File</span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      // This would normally open the camera
                      document.getElementById('image')?.click();
                    }} 
                    className="flex items-center gap-2"
                  >
                    <Camera size={16} />
                    <span>Take Photo</span>
                  </Button>
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="max-h-60 rounded-md border"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-govt-orange hover:bg-opacity-90 hover:scale-105 transition-all"
              disabled={isSubmitting || !selectedArea || !description}
            >
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default IssueReportForm;
