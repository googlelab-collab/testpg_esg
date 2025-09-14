import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { 
  LogOut, User, BarChart3, Leaf, Users, Shield, FileBarChart, Target, Calendar
} from "lucide-react";
import logo from "@/assets/logo.svg";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">


      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <img src={logo} alt="ESGuite Logo" className="h-20 w-auto" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome to ESGuite Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your Environmental, Social, and Governance initiatives with comprehensive analytics and insights powered by AI-driven sustainability intelligence.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Overall ESG Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">78.5</div>
              <div className="text-sm text-gray-500">+2.3% from last month</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Carbon Footprint</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">125k</div>
              <div className="text-sm text-gray-500">tCO2e annually</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">94%</div>
              <div className="text-sm text-gray-500">Frameworks compliant</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">67</div>
              <div className="text-sm text-gray-500">ESG initiatives</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="group border-green-200 hover:border-green-400 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3 bg-gradient-to-br from-green-50 to-emerald-50 relative overflow-hidden"
                onClick={() => window.location.href = '/environmental/ghg-emissions'}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-green-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-green-900 group-hover:text-green-700 transition-colors">Environmental</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Track emissions, energy, water, waste, and biodiversity metrics across operations with real-time analytics.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xl">🌱</span>
                  <span className="font-medium text-gray-700">GHG Emissions</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xl">⚡</span>
                  <span className="font-medium text-gray-700">Energy Analytics</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xl">💧</span>
                  <span className="font-medium text-gray-700">Water Management</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-blue-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3 bg-gradient-to-br from-blue-50 to-sky-50 relative overflow-hidden"
                onClick={() => window.location.href = '/social/workforce-diversity'}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-sky-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">Social</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Monitor workforce diversity, safety, community impact, and human rights initiatives with comprehensive reporting.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xl">👥</span>
                  <span className="font-medium text-gray-700">Workforce Diversity</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xl">🛡️</span>
                  <span className="font-medium text-gray-700">Employee Safety</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xl">🏘️</span>
                  <span className="font-medium text-gray-700">Community Impact</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group border-purple-200 hover:border-purple-400 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-3 bg-gradient-to-br from-purple-50 to-violet-50 relative overflow-hidden"
                onClick={() => window.location.href = '/governance/board-composition'}>
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mr-10 -mt-10 opacity-20"></div>
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-purple-900 group-hover:text-purple-700 transition-colors">Governance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Ensure regulatory compliance, board oversight, and ethical business practices with advanced governance tools.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xl">🏛️</span>
                  <span className="font-medium text-gray-700">Board Composition</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xl">💰</span>
                  <span className="font-medium text-gray-700">Executive Compensation</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-xl">🔒</span>
                  <span className="font-medium text-gray-700">Cybersecurity</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-16 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              <BarChart3 className="h-5 w-5 mr-3" />
              View Dashboard
            </Button>
            <Button 
              variant="outline" 
              className="h-16 text-lg font-semibold border-2 hover:bg-blue-50 hover:border-blue-300 transition-all"
            >
              <FileBarChart className="h-5 w-5 mr-3" />
              Generate Report
            </Button>
            <Button 
              variant="outline" 
              className="h-16 text-lg font-semibold border-2 hover:bg-purple-50 hover:border-purple-300 transition-all"
            >
              <Target className="h-5 w-5 mr-3" />
              Set Targets
            </Button>
            <Button 
              variant="outline" 
              className="h-16 text-lg font-semibold border-2 hover:bg-orange-50 hover:border-orange-300 transition-all"
            >
              <Calendar className="h-5 w-5 mr-3" />
              Schedule Review
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}