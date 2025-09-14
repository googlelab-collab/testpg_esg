import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Building, Shield, User, Lock, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.svg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (username === "admin" && password === "admin123") {
        // Admin login success
        const response = await fetch("/api/auth/admin-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          toast({
            title: "Login Successful",
            description: "Welcome back, Administrator!",
          });
          window.location.href = "/";
        } else {
          throw new Error("Admin login failed");
        }
      } else {
        toast({
          title: "Invalid Credentials",
          description: "Please check your username and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Unable to authenticate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnterpriseSSO = () => {
    // Redirect to enterprise SSO login
    window.location.href = "/api/login";
  };

  const handleReplitAuth = () => {
    // Redirect to Replit authentication
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="ESGuite Logo" className="h-16" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to ESGuite</h1>
          <p className="text-gray-600 mt-2">Choose your preferred login method</p>
        </div>

        {/* Admin Login Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Administrator Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Admin Login"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Separator */}
        <div className="relative mb-4">
          <Separator />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="px-2 bg-gradient-to-br from-green-50 to-blue-50 text-gray-500 text-sm">
              or
            </span>
          </div>
        </div>

        {/* Enterprise SSO Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5 text-blue-600" />
              Enterprise SSO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Sign in with your organization's single sign-on provider
            </p>
            <Button 
              onClick={handleEnterpriseSSO}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue with Enterprise SSO
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Replit Auth Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-r from-orange-400 to-pink-500 rounded"></div>
              Replit Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Sign in with your Replit account for quick access
            </p>
            <Button 
              onClick={handleReplitAuth}
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50"
            >
              Continue with Replit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}