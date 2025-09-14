import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Database, 
  Play, 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw,
  Table,
  Users,
  FileBarChart,
  Settings
} from "lucide-react";

export default function DatabaseConsole() {
  const [sqlQuery, setSqlQuery] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const executeQuery = async () => {
    if (!sqlQuery.trim()) return;
    
    setIsExecuting(true);
    try {
      const response = await fetch('/api/admin/execute-sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery })
      });
      
      const result = await response.json();
      setQueryResult(result);
    } catch (error) {
      setQueryResult({ error: 'Failed to execute query' });
    } finally {
      setIsExecuting(false);
    }
  };

  const quickQueries = [
    {
      name: "All Users",
      query: "SELECT id, email, first_name, last_name, role, is_active FROM users ORDER BY created_at DESC;",
      icon: Users
    },
    {
      name: "ESG Scores",
      query: "SELECT * FROM esg_scores ORDER BY created_at DESC LIMIT 10;",
      icon: FileBarChart
    },
    {
      name: "Database Tables",
      query: "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';",
      icon: Table
    },
    {
      name: "User Roles",
      query: "SELECT role, COUNT(*) as count FROM users GROUP BY role;",
      icon: Settings
    }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Database Console</h1>
        <p className="text-gray-600 mt-1">Execute SQL queries and manage database operations</p>
      </div>

      {/* Database Status */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
              <Database className="h-4 w-4" />
              Connection Status
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
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Connections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">3</div>
            <p className="text-xs text-gray-500 mt-1">Pool size: 20</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Database Size
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">2.4 GB</div>
            <p className="text-xs text-gray-500 mt-1">Growing +12MB/day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Last Backup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">2h ago</div>
            <p className="text-xs text-gray-500 mt-1">Auto-backup enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* SQL Query Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            SQL Query Console
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Textarea
              placeholder="Enter your SQL query here..."
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="min-h-32 font-mono"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={executeQuery}
              disabled={isExecuting || !sqlQuery.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {isExecuting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Execute Query
            </Button>
            <Button variant="outline" onClick={() => setSqlQuery("")}>
              Clear
            </Button>
          </div>

          {/* Query Result */}
          {queryResult && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Query Result:</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                  {JSON.stringify(queryResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Queries */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {quickQueries.map((query, index) => {
              const IconComponent = query.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="flex items-center justify-start h-auto p-4"
                  onClick={() => setSqlQuery(query.query)}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="h-5 w-5 text-gray-600" />
                    <div className="text-left">
                      <div className="font-medium">{query.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-48">
                        {query.query}
                      </div>
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Database Operations */}
      <Card>
        <CardHeader>
          <CardTitle>Database Operations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4">
              <div className="flex flex-col items-center gap-2">
                <Download className="h-6 w-6 text-blue-600" />
                <span className="font-medium">Export Database</span>
                <span className="text-xs text-gray-500">Download SQL dump</span>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4">
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-6 w-6 text-green-600" />
                <span className="font-medium">Import Data</span>
                <span className="text-xs text-gray-500">Upload SQL file</span>
              </div>
            </Button>

            <Button variant="outline" className="h-auto p-4">
              <div className="flex flex-col items-center gap-2">
                <RefreshCw className="h-6 w-6 text-purple-600" />
                <span className="font-medium">Optimize Tables</span>
                <span className="text-xs text-gray-500">Analyze & vacuum</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Warning */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Direct database operations can affect system stability. 
                Always backup your data before making structural changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}