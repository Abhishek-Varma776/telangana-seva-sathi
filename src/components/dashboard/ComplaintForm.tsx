
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Upload, Camera } from "lucide-react";

interface ComplaintFormProps {
  newComplaint: {
    subject: string;
    description: string;
    department: string;
    area: string;
    address: string;
    pincode: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
  hideFields?: string[]; // Add this to hide specific fields
}

const ComplaintForm = ({ 
  newComplaint, 
  onInputChange, 
  onSelectChange, 
  onSubmit,
  onCancel,
  hideFields = []
}: ComplaintFormProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const toggleMap = () => {
    setShowMap(!showMap);
  };

  const handleLocationSelect = (location: string) => {
    onInputChange({
      target: { name: 'address', value: location }
    } as React.ChangeEvent<HTMLTextAreaElement>);
    setShowMap(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-govt-blue">File a New Complaint</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              name="subject"
              placeholder="Brief subject of your complaint"
              value={newComplaint.subject}
              onChange={onInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Provide detailed information about the issue"
              value={newComplaint.description}
              onChange={onInputChange}
              className="min-h-[120px]"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!hideFields.includes("department") && (
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  onValueChange={(value) => onSelectChange("department", value)}
                  value={newComplaint.department}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="drainage">Drainage</SelectItem>
                    <SelectItem value="potholes">Potholes</SelectItem>
                    <SelectItem value="streetlight">Streetlight</SelectItem>
                    <SelectItem value="garbage">Garbage Collection</SelectItem>
                    <SelectItem value="safety">Public Safety</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="area">Area/Colony</Label>
              <Input
                id="area"
                name="area"
                placeholder="Your area or colony name"
                value={newComplaint.area}
                onChange={onInputChange}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Location</Label>
            <div className="flex gap-3">
              <Textarea
                id="address"
                name="address"
                placeholder="Full address where the issue is located"
                value={newComplaint.address}
                onChange={onInputChange}
                className="flex-grow"
                required
              />
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={toggleMap}
              >
                <MapPin size={16} />
                <span>Map</span>
              </Button>
            </div>
            
            {showMap && (
              <div className="mt-2 border rounded-md p-4">
                <p className="text-sm text-center mb-2">Google Maps will be displayed here</p>
                <div className="h-40 bg-gray-100 rounded-md flex items-center justify-center mb-2">
                  <MapPin className="text-gray-400" size={32} />
                </div>
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => handleLocationSelect("Selected Location")}
                  >
                    Select Location
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowMap(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pincode">PIN Code</Label>
            <Input
              id="pincode"
              name="pincode"
              placeholder="6-digit PIN code"
              value={newComplaint.pincode}
              onChange={onInputChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Upload Image</Label>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Input 
                  ref={fileInputRef}
                  id="image-upload" 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Input 
                  ref={cameraInputRef}
                  id="image-capture" 
                  type="file" 
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleFileUpload}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  <span>Choose File</span>
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCameraCapture}
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
          
          <div className="pt-4 flex flex-wrap gap-4">
            <Button type="submit" className="bg-govt-orange hover:bg-opacity-90">
              Submit Complaint
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ComplaintForm;
