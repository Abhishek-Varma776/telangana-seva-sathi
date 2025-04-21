
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Complaint {
  id: string;
  subject: string;
}

interface FeedbackFormProps {
  complaints: Complaint[];
}

const FeedbackForm = ({ complaints }: FeedbackFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-govt-blue">Provide Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="complaint-id">Complaint ID</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select complaint" />
              </SelectTrigger>
              <SelectContent>
                {complaints.map(complaint => (
                  <SelectItem key={complaint.id} value={complaint.id}>
                    {complaint.id} - {complaint.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Rate your experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Excellent</SelectItem>
                <SelectItem value="4">Good</SelectItem>
                <SelectItem value="3">Average</SelectItem>
                <SelectItem value="2">Below Average</SelectItem>
                <SelectItem value="1">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="feedback">Detailed Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="Share your experience with how your complaint was handled"
              className="min-h-[120px]"
            />
          </div>
          
          <div className="pt-4">
            <Button className="bg-govt-blue hover:bg-govt-darkblue">
              Submit Feedback
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FeedbackForm;
