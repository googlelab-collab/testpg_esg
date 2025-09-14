import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, Shield, Users, BarChart3, 
  Target, TrendingUp, CheckCircle, ArrowRight 
} from "lucide-react";
import logo from "@/assets/logo.svg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="ESGuite Logo" className="h-16 w-auto" />
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-600 border-green-600">
              Enterprise Ready
            </Badge>
            <Button 
              onClick={() => window.location.href = '/login'}
              className="bg-green-600 hover:bg-green-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your ESG Impact with 
            <span className="text-green-600"> Data-Driven Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            ESGuite is the comprehensive platform for Environmental, Social, and Governance 
            management, providing real-time analytics, compliance tracking, and strategic insights 
            for sustainable business growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => window.location.href = '/login'}
              className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3"
            >
              Start Your ESG Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-3"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need for ESG Excellence
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Comprehensive tools and insights to manage your environmental, social, and governance initiatives effectively.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-green-200 hover:border-green-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-green-900">Environmental Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Track GHG emissions, energy consumption, water usage, and biodiversity metrics with real-time monitoring.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Carbon footprint analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Renewable energy tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Waste management optimization
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-blue-900">Social Responsibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Monitor workforce diversity, safety metrics, community impact, and human rights across your operations.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Employee safety analytics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Diversity & inclusion metrics
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-blue-500 mr-2" />
                  Community investment tracking
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 hover:border-purple-300 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-purple-900">Governance Excellence</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Ensure compliance with regulatory frameworks, board oversight, and ethical business practices.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                  Regulatory compliance tracking
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                  Board composition analysis
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-purple-500 mr-2" />
                  Risk management framework
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Trusted by Global Organizations
            </h2>
            <p className="text-gray-600">
              Leading companies use ESGuite to drive sustainable business practices
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600">Organizations</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50M+</div>
              <div className="text-gray-600">Data Points</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">25+</div>
              <div className="text-gray-600">ESG Frameworks</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your ESG Strategy?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join leading organizations in building a sustainable future with data-driven ESG insights.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/login'}
            className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img src={logo} alt="ESGuite Logo" className="h-8 filter invert" />
              <span className="text-sm text-gray-400">
                © 2024 ESGuite. All rights reserved.
              </span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}