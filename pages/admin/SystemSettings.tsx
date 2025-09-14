import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Database, 
  Shield, 
  Bell, 
  Mail, 
  Server, 
  Clock,
  Users,
  Activity,
  HardDrive,
  Wifi
} from "lucide-react";

export default function SystemSettings() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
      </div>

      {/* System Status Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Server className="h-4 w-4" />
              Server Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Online</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Uptime: 99.9%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">Connected</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">PostgreSQL 15.4</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">24</div>
            <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              System Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">Low</div>
            <p className="text-xs text-gray-500 mt-1">CPU: 12%, RAM: 34%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Authentication Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Enable Multi-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Require 2FA for admin accounts</p>
              </div>
              <Switch />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label>Session Timeout</Label>
                <p className="text-sm text-gray-500">Auto-logout inactive users</p>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  defaultValue="30" 
                  className="w-16 text-sm"
                />
                <span className="text-sm text-gray-500">minutes</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Password Complexity</Label>
                <p className="text-sm text-gray-500">Enforce strong passwords</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Login Attempt Limit</Label>
                <p className="text-sm text-gray-500">Block after failed attempts</p>
              </div>
              <Input 
                type="number" 
                defaultValue="5" 
                className="w-16 text-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-gray-500">Send system alerts via email</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>ESG Score Alerts</Label>
                <p className="text-sm text-gray-500">Notify on score changes</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Compliance Deadlines</Label>
                <p className="text-sm text-gray-500">Alert for upcoming deadlines</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div>
              <Label>Admin Email</Label>
              <Input 
                type="email" 
                defaultValue="admin@esgsuite.com"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              System Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Automatic Backups</Label>
                <p className="text-sm text-gray-500">Daily database backups</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Data Retention</Label>
                <p className="text-sm text-gray-500">Keep historical data</p>
              </div>
              <div className="flex items-center gap-2">
                <Input 
                  type="number" 
                  defaultValue="365" 
                  className="w-20 text-sm"
                />
                <span className="text-sm text-gray-500">days</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Maintenance Actions</Label>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Activity className="h-4 w-4 mr-2" />
                  Clear System Logs
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <HardDrive className="h-4 w-4 mr-2" />
                  Optimize Database
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API & Integration Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              API & Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>API Rate Limiting</Label>
                <p className="text-sm text-gray-500">Requests per minute</p>
              </div>
              <Input 
                type="number" 
                defaultValue="100" 
                className="w-20 text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>CORS Origins</Label>
                <p className="text-sm text-gray-500">Allowed domains</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div>
              <Label>Webhook Endpoints</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Active</Badge>
                  <span className="text-sm">ESG Score Updates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Active</Badge>
                  <span className="text-sm">Compliance Alerts</span>
                </div>
              </div>
            </div>

            <Button className="w-full">
              Configure Integrations
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Save Settings */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Reset to Defaults</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}