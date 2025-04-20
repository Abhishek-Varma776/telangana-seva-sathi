
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const OfficerAuth = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ employeeId: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    employeeId: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    district: "",
    password: "",
    confirmPassword: ""
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleDepartmentChange = (value: string) => {
    setRegisterData({ ...registerData, department: value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login data:", loginData);
    // In a real app, this would validate with backend
    // For demo, we'll redirect to officer dashboard
    navigate("/officer-dashboard");
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Register data:", registerData);
    // In a real app, this would validate with backend
    // For demo, we'll redirect to officer dashboard
    navigate("/officer-dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12 bg-govt-lightgray">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-govt-darkblue">Officer Login</CardTitle>
                    <CardDescription>
                      Enter your credentials to access your account
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input 
                          id="employeeId" 
                          name="employeeId" 
                          placeholder="Your employee ID" 
                          value={loginData.employeeId}
                          onChange={handleLoginChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input 
                          id="password" 
                          name="password" 
                          type="password" 
                          value={loginData.password}
                          onChange={handleLoginChange}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full bg-govt-darkblue hover:bg-govt-blue">
                        Login
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
              
              <TabsContent value="register">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-govt-darkblue">Officer Registration</CardTitle>
                    <CardDescription>
                      Create an account to manage and resolve complaints
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleRegister}>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          placeholder="Your full name" 
                          value={registerData.name}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="employeeId">Employee ID</Label>
                        <Input 
                          id="employeeId" 
                          name="employeeId" 
                          placeholder="Your employee ID" 
                          value={registerData.employeeId}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          placeholder="official.email@telangana.gov.in" 
                          value={registerData.email}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone" 
                          placeholder="10-digit mobile number" 
                          value={registerData.phone}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select 
                          onValueChange={handleDepartmentChange}
                          defaultValue={registerData.department}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="municipal">Municipal Administration</SelectItem>
                            <SelectItem value="water">Water Board</SelectItem>
                            <SelectItem value="electricity">Electricity Department</SelectItem>
                            <SelectItem value="transport">Transport Department</SelectItem>
                            <SelectItem value="health">Health Department</SelectItem>
                            <SelectItem value="education">Education Department</SelectItem>
                            <SelectItem value="panchayat">Panchayat Raj</SelectItem>
                            <SelectItem value="revenue">Revenue Department</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="designation">Designation</Label>
                        <Input 
                          id="designation" 
                          name="designation" 
                          placeholder="Your official designation" 
                          value={registerData.designation}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Input 
                          id="district" 
                          name="district" 
                          placeholder="District of operation" 
                          value={registerData.district}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="reg-password">Password</Label>
                        <Input 
                          id="reg-password" 
                          name="password" 
                          type="password" 
                          value={registerData.password}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input 
                          id="confirmPassword" 
                          name="confirmPassword" 
                          type="password" 
                          value={registerData.confirmPassword}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full bg-govt-darkblue">
                        Register
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OfficerAuth;
