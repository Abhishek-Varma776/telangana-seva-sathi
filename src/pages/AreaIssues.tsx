import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplet, CircleDashed, Lightbulb, Trash2, ShieldCheck, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AreaIssue {
  department: string;
  issue_count: number;
  last_reported: string;
  pending_count: number;
  in_progress_count: number;
  resolved_count: number;
}

const departmentIcons = {
  drainage: <Droplet className="h-8 w-8" />,
  potholes: <CircleDashed className="h-8 w-8" />,
  streetlight: <Lightbulb className="h-8 w-8" />,
  garbage: <Trash2 className="h-8 w-8" />,
  safety: <ShieldCheck className="h-8 w-8" />
};

const departmentNames = {
  drainage: "Drainage",
  potholes: "Road & Potholes",
  streetlight: "Streetlight",
  garbage: "Garbage Collection",
  safety: "Public Safety"
};

const sampleIssues: AreaIssue[] = [
  {
    department: "drainage",
    issue_count: 3,
    last_reported: "2025-04-15",
    pending_count: 1,
    in_progress_count: 1,
    resolved_count: 1
  },
  {
    department: "potholes",
    issue_count: 5,
    last_reported: "2025-04-18",
    pending_count: 2,
    in_progress_count: 2,
    resolved_count: 1
  },
  {
    department: "streetlight",
    issue_count: 2,
    last_reported: "2025-04-20",
    pending_count: 1,
    in_progress_count: 1,
    resolved_count: 0
  }
];

const AreaIssues = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const area = searchParams.get("area");
  const [issues, setIssues] = useState<AreaIssue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (!area) {
      setError("No area specified");
      setLoading(false);
      return;
    }

    const fetchAreaIssues = async () => {
      try {
        try {
          const response = await window.apiConnect.getAreaIssues(area);
          
          if (response.status === "success" && response.issues && response.issues.length > 0) {
            setIssues(response.issues);
          } else {
            console.log("No issues found, using sample data");
            setIssues(sampleIssues);
          }
        } catch (err) {
          console.error("Error with API call:", err);
          setIssues(sampleIssues);
        }
      } catch (err) {
        console.error("Error fetching area issues:", err);
        setError("An error occurred while fetching area issues");
      } finally {
        setLoading(false);
      }
    };

    fetchAreaIssues();
  }, [area]);

  const handleReportIssue = (department: string) => {
    const userCheck = sessionStorage.getItem("userType");
    if (!userCheck) {
      toast({
        title: "Authentication Required",
        description: "Please login to report an issue",
        variant: "destructive"
      });
      sessionStorage.setItem("redirectAfterLogin", `/issue/${department}`);
      navigate("/citizen-login");
      return;
    }
    navigate(`/issue/${department}`);
  };

  if (!area) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No area specified. Please select an area first.</p>
              <Button 
                className="mt-4" 
                onClick={() => navigate("/")}
              >
                Go to Home
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-govt-blue text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <MapPin className="h-16 w-16" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Issues in {area}</h1>
          <p className="max-w-2xl mx-auto">
            View and report issues in your area. Join your neighbors in keeping your community clean, safe, and well-maintained.
          </p>
        </div>
      </div>
      
      <main className="flex-grow py-12 bg-govt-lightgray">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-xl">Loading area issues...</p>
            </div>
          ) : error ? (
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-red-500">Error</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-8 text-center">Reported Issues</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {issues.map((issue, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div className="bg-govt-blue text-white p-3 rounded-full">
                        {departmentIcons[issue.department as keyof typeof departmentIcons] || <MapPin className="h-8 w-8" />}
                      </div>
                      <div>
                        <CardTitle>{departmentNames[issue.department as keyof typeof departmentNames] || issue.department}</CardTitle>
                        <CardDescription>
                          Total reports: {issue.issue_count}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-yellow-100 p-2 rounded">
                            <p className="text-yellow-800 font-bold">{issue.pending_count}</p>
                            <p className="text-xs text-yellow-800">Pending</p>
                          </div>
                          <div className="bg-blue-100 p-2 rounded">
                            <p className="text-blue-800 font-bold">{issue.in_progress_count}</p>
                            <p className="text-xs text-blue-800">In Progress</p>
                          </div>
                          <div className="bg-green-100 p-2 rounded">
                            <p className="text-green-800 font-bold">{issue.resolved_count}</p>
                            <p className="text-xs text-green-800">Resolved</p>
                          </div>
                        </div>
                        
                        <p className="text-sm text-gray-500">
                          Last reported: {new Date(issue.last_reported).toLocaleDateString()}
                        </p>
                        
                        <Button 
                          onClick={() => handleReportIssue(issue.department)} 
                          className="w-full bg-govt-orange hover:bg-opacity-90 hover:scale-105 transition-all"
                        >
                          Report Similar Issue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <h3 className="text-xl font-semibold mb-4">Report a Different Issue</h3>
                <div className="flex flex-wrap justify-center gap-4">
                  {Object.entries(departmentNames).map(([dept, name]) => (
                    <Button 
                      key={dept}
                      onClick={() => handleReportIssue(dept)}
                      className="bg-govt-orange hover:bg-opacity-90"
                    >
                      Report {name} Issue
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AreaIssues;
