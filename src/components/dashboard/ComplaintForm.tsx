
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  onCancel?: () => void; // Added optional onCancel prop
}

const ComplaintForm = ({ 
  newComplaint, 
  onInputChange, 
  onSelectChange, 
  onSubmit,
  onCancel 
}: ComplaintFormProps) => {
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
                  <SelectItem value="municipal">Municipal Administration</SelectItem>
                  <SelectItem value="water">Water Board</SelectItem>
                  <SelectItem value="electricity">Electricity Department</SelectItem>
                  <SelectItem value="transport">Transport Department</SelectItem>
                  <SelectItem value="health">Health Department</SelectItem>
                  <SelectItem value="education">Education Department</SelectItem>
                  <SelectItem value="panchayat">Panchayat Raj</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
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
            <Label htmlFor="address">Complete Address</Label>
            <Textarea
              id="address"
              name="address"
              placeholder="Full address where the issue is located"
              value={newComplaint.address}
              onChange={onInputChange}
              required
            />
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
