import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, UserPlus, Edit, Trash2, Shield, Eye, Check, X 
} from "lucide-react";
import { USER_ROLES, ROLE_DESCRIPTIONS, PERMISSIONS, ROLE_PERMISSIONS, getUserRoleDescription } from "@shared/roles";
import { apiRequest } from "@/lib/queryClient";

export default function UserManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ['/api/users'],
    retry: false,
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: any) => {
      return await apiRequest('/api/users', {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setShowCreateForm(false);
      toast({
        title: "User Created",
        description: "New user has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, userData }: { id: string, userData: any }) => {
      return await apiRequest(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      setEditingUser(null);
      toast({
        title: "User Updated",
        description: "User information has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      return await apiRequest(`/api/users/${userId}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: "User Deleted",
        description: "User has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleCreateUser = (formData: FormData) => {
    const userData = {
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      role: formData.get('role'),
      isActive: formData.get('isActive') === 'on'
    };
    createUserMutation.mutate(userData);
  };

  const handleUpdateUser = (formData: FormData) => {
    const userData = {
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      role: formData.get('role'),
      isActive: formData.get('isActive') === 'on'
    };
    updateUserMutation.mutate({ id: editingUser.id, userData });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts, roles, and permissions</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-green-600 hover:bg-green-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Role Information Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {Object.values(USER_ROLES).map((role) => {
          const roleInfo = getUserRoleDescription(role);
          const userCount = users?.filter((u: any) => u.role === role).length || 0;
          
          return (
            <Card key={role} className="border-l-4" style={{ borderLeftColor: roleInfo?.color === 'purple' ? '#8B5CF6' : roleInfo?.color === 'red' ? '#EF4444' : roleInfo?.color === 'blue' ? '#3B82F6' : '#10B981' }}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <span className="text-2xl">{roleInfo?.emoji}</span>
                  {roleInfo?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{roleInfo?.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Active Users</span>
                  <Badge variant="outline">{userCount}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            All Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users?.map((user: any) => {
              const roleInfo = getUserRoleDescription(user.role);
              
              return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xl">{roleInfo?.emoji || '👤'}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.firstName} {user.lastName}</span>
                        {user.isActive ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-red-600 border-red-600">
                            <X className="h-3 w-3 mr-1" />
                            Inactive
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                      <div className="text-xs text-gray-500">{roleInfo?.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteUserMutation.mutate(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Create New User</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateUser(new FormData(e.target as HTMLFormElement));
              }} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select name="role" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(USER_ROLES).map((role) => {
                        const roleInfo = getUserRoleDescription(role);
                        return (
                          <SelectItem key={role} value={role}>
                            {roleInfo?.emoji} {roleInfo?.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="isActive" name="isActive" defaultChecked />
                  <Label htmlFor="isActive">Active</Label>
                </div>
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">Create User</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}