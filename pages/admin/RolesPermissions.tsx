import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Eye, Edit, Settings, Database } from "lucide-react";
import { USER_ROLES, ROLE_DESCRIPTIONS, PERMISSIONS, ROLE_PERMISSIONS, getUserRoleDescription } from "@shared/roles";

export default function RolesPermissions() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
        <p className="text-gray-600 mt-1">Manage system roles and their associated permissions</p>
      </div>

      {/* Role Overview Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.values(USER_ROLES).map((role) => {
          const roleInfo = getUserRoleDescription(role);
          const permissions = ROLE_PERMISSIONS[role];
          
          return (
            <Card key={role} className="border-l-4" style={{ borderLeftColor: roleInfo?.color === 'purple' ? '#8B5CF6' : roleInfo?.color === 'red' ? '#EF4444' : roleInfo?.color === 'blue' ? '#3B82F6' : '#10B981' }}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{roleInfo?.emoji}</span>
                  {roleInfo?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">{roleInfo?.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Permissions</span>
                    <Badge variant="outline">{permissions.length}</Badge>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    {permissions.slice(0, 3).map((permission) => (
                      <div key={permission} className="flex items-center gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                        {permission.replace(/_/g, ' ').toLowerCase()}
                      </div>
                    ))}
                    {permissions.length > 3 && (
                      <div className="text-gray-400">+{permissions.length - 3} more...</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Detailed Permissions Matrix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Permission Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Permission</th>
                  {Object.values(USER_ROLES).map((role) => {
                    const roleInfo = getUserRoleDescription(role);
                    return (
                      <th key={role} className="text-center py-3 px-4 font-semibold">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg">{roleInfo?.emoji}</span>
                          <span className="text-xs">{roleInfo?.name}</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {Object.values(PERMISSIONS).map((permission) => (
                  <tr key={permission} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      {permission.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </td>
                    {Object.values(USER_ROLES).map((role) => (
                      <td key={`${permission}-${role}`} className="text-center py-3 px-4">
                        {ROLE_PERMISSIONS[role].includes(permission) ? (
                          <div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div>
                        ) : (
                          <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto"></div>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Permission Categories */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Eye className="h-5 w-5" />
              View Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.values(PERMISSIONS).filter(p => p.includes('VIEW')).map((permission) => (
                <div key={permission} className="text-sm text-gray-600">
                  • {permission.replace(/_/g, ' ').toLowerCase()}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <Edit className="h-5 w-5" />
              Edit Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.values(PERMISSIONS).filter(p => p.includes('EDIT') || p.includes('CREATE') || p.includes('UPDATE')).map((permission) => (
                <div key={permission} className="text-sm text-gray-600">
                  • {permission.replace(/_/g, ' ').toLowerCase()}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Settings className="h-5 w-5" />
              Admin Permissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.values(PERMISSIONS).filter(p => p.includes('MANAGE') || p.includes('DELETE') || p.includes('SYSTEM')).map((permission) => (
                <div key={permission} className="text-sm text-gray-600">
                  • {permission.replace(/_/g, ' ').toLowerCase()}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}