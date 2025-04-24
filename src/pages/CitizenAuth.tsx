
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const CitizenAuth = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    phone: "",
    aadhar: "",
    address: "",
    district: "",
    pincode: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await window.apiConnect.citizenLogin(loginData);
      
      if (response.status === "success") {
        toast.success("Login successful!");
        navigate("/citizen-dashboard");
      } else {
        toast.error(response.message || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!registerData.name || !registerData.email || !registerData.phone || 
        !registerData.aadhar || !registerData.address || !registerData.district || 
        !registerData.pincode || !registerData.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Validate password match
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Validate phone number (10 digits)
    if (!/^\d{10}$/.test(registerData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    
    // Validate Aadhar number (12 digits)
    if (!/^\d{12}$/.test(registerData.aadhar)) {
      toast.error("Please enter a valid 12-digit Aadhar number");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await window.apiConnect.citizenRegister(registerData);
      
      if (response.status === "success") {
        toast.success("Registration successful! Please login.");
        // Reset form and switch to login tab
        setRegisterData({
          name: "",
          email: "",
          phone: "",
          aadhar: "",
          address: "",
          district: "",
          pincode: "",
          password: "",
          confirmPassword: ""
        });
        // Find the login tab trigger and click it
        const loginTab = document.querySelector('[data-state="inactive"][value="login"]');
        if (loginTab instanceof HTMLElement) {
          loginTab.click();
        }
      } else {
        toast.error(response.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 flex flex-col items-center justify-center bg-govt-lightgray">
        <div className="container max-w-lg px-4">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle className="text-govt-blue">Citizen Login</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="your.email@example.com" 
                        value={loginData.email}
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
                    <Button 
                      type="submit" 
                      className="w-full bg-govt-blue hover:bg-govt-darkblue"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle className="text-govt-blue">Citizen Registration</CardTitle>
                  <CardDescription>
                    Create an account to file and track complaints
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="John Doe" 
                        value={registerData.name}
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
                        placeholder="your.email@example.com" 
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
                      <Label htmlFor="aadhar">Aadhar Number</Label>
                      <Input 
                        id="aadhar" 
                        name="aadhar" 
                        placeholder="12-digit Aadhar number" 
                        value={registerData.aadhar}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address" 
                        name="address" 
                        placeholder="Your full address" 
                        value={registerData.address}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="district">District</Label>
                        <Input 
                          id="district" 
                          name="district" 
                          placeholder="District" 
                          value={registerData.district}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input 
                          id="pincode" 
                          name="pincode" 
                          placeholder="6-digit PIN code" 
                          value={registerData.pincode}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
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
                    <Button 
                      type="submit" 
                      className="w-full bg-govt-orange"
                      disabled={isLoading}
                    >
                      {isLoading ? "Registering..." : "Register"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CitizenAuth;
