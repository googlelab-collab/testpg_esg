export const USER_ROLES = {
  EXECUTIVE: 'executive',
  ADMIN: 'admin', 
  MANAGER: 'manager',
  OPERATIONS: 'operations'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

export const PERMISSIONS = {
  // Dashboard and Analytics
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_EXECUTIVE_DASHBOARD: 'view_executive_dashboard',
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_REPORTS: 'export_reports',
  
  // ESG Data Management
  VIEW_ESG_DATA: 'view_esg_data',
  EDIT_ESG_DATA: 'edit_esg_data',
  DELETE_ESG_DATA: 'delete_esg_data',
  APPROVE_ESG_DATA: 'approve_esg_data',
  
  // Parameters and Configuration
  VIEW_PARAMETERS: 'view_parameters',
  EDIT_PARAMETERS: 'edit_parameters',
  CONFIGURE_PARAMETERS: 'configure_parameters',
  
  // User Management
  VIEW_USERS: 'view_users',
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  MANAGE_ROLES: 'manage_roles',
  
  // Compliance and Auditing
  VIEW_COMPLIANCE: 'view_compliance',
  MANAGE_COMPLIANCE: 'manage_compliance',
  AUDIT_ACCESS: 'audit_access',
  
  // System Administration
  SYSTEM_CONFIG: 'system_config',
  DATABASE_ACCESS: 'database_access',
  API_ACCESS: 'api_access',
  
  // Environmental Module
  VIEW_ENVIRONMENTAL: 'view_environmental',
  EDIT_ENVIRONMENTAL: 'edit_environmental',
  MANAGE_ENVIRONMENTAL: 'manage_environmental',
  
  // Social Module
  VIEW_SOCIAL: 'view_social',
  EDIT_SOCIAL: 'edit_social',
  MANAGE_SOCIAL: 'manage_social',
  
  // Governance Module
  VIEW_GOVERNANCE: 'view_governance',
  EDIT_GOVERNANCE: 'edit_governance',
  MANAGE_GOVERNANCE: 'manage_governance'
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [USER_ROLES.EXECUTIVE]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_EXECUTIVE_DASHBOARD,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_ESG_DATA,
    PERMISSIONS.APPROVE_ESG_DATA,
    PERMISSIONS.VIEW_PARAMETERS,
    PERMISSIONS.VIEW_COMPLIANCE,
    PERMISSIONS.AUDIT_ACCESS,
    PERMISSIONS.VIEW_ENVIRONMENTAL,
    PERMISSIONS.VIEW_SOCIAL,
    PERMISSIONS.VIEW_GOVERNANCE,
    PERMISSIONS.VIEW_USERS
  ],
  
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_EXECUTIVE_DASHBOARD,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_ESG_DATA,
    PERMISSIONS.EDIT_ESG_DATA,
    PERMISSIONS.DELETE_ESG_DATA,
    PERMISSIONS.APPROVE_ESG_DATA,
    PERMISSIONS.VIEW_PARAMETERS,
    PERMISSIONS.EDIT_PARAMETERS,
    PERMISSIONS.CONFIGURE_PARAMETERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.DELETE_USERS,
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.VIEW_COMPLIANCE,
    PERMISSIONS.MANAGE_COMPLIANCE,
    PERMISSIONS.AUDIT_ACCESS,
    PERMISSIONS.SYSTEM_CONFIG,
    PERMISSIONS.DATABASE_ACCESS,
    PERMISSIONS.API_ACCESS,
    PERMISSIONS.VIEW_ENVIRONMENTAL,
    PERMISSIONS.EDIT_ENVIRONMENTAL,
    PERMISSIONS.MANAGE_ENVIRONMENTAL,
    PERMISSIONS.VIEW_SOCIAL,
    PERMISSIONS.EDIT_SOCIAL,
    PERMISSIONS.MANAGE_SOCIAL,
    PERMISSIONS.VIEW_GOVERNANCE,
    PERMISSIONS.EDIT_GOVERNANCE,
    PERMISSIONS.MANAGE_GOVERNANCE
  ],
  
  [USER_ROLES.MANAGER]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_ESG_DATA,
    PERMISSIONS.EDIT_ESG_DATA,
    PERMISSIONS.VIEW_PARAMETERS,
    PERMISSIONS.EDIT_PARAMETERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_COMPLIANCE,
    PERMISSIONS.VIEW_ENVIRONMENTAL,
    PERMISSIONS.EDIT_ENVIRONMENTAL,
    PERMISSIONS.VIEW_SOCIAL,
    PERMISSIONS.EDIT_SOCIAL,
    PERMISSIONS.VIEW_GOVERNANCE,
    PERMISSIONS.EDIT_GOVERNANCE
  ],
  
  [USER_ROLES.OPERATIONS]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_ESG_DATA,
    PERMISSIONS.EDIT_ESG_DATA,
    PERMISSIONS.VIEW_PARAMETERS,
    PERMISSIONS.VIEW_ENVIRONMENTAL,
    PERMISSIONS.EDIT_ENVIRONMENTAL,
    PERMISSIONS.VIEW_SOCIAL,
    PERMISSIONS.EDIT_SOCIAL,
    PERMISSIONS.VIEW_GOVERNANCE
  ]
};

export const ROLE_DESCRIPTIONS = {
  [USER_ROLES.EXECUTIVE]: {
    name: 'Executive',
    emoji: '👔',
    description: 'C-level executives with full visibility across all ESG initiatives and strategic oversight',
    color: 'purple'
  },
  [USER_ROLES.ADMIN]: {
    name: 'Administrator', 
    emoji: '🔧',
    description: 'System administrators with full access to manage users, system configuration, and all ESG modules',
    color: 'red'
  },
  [USER_ROLES.MANAGER]: {
    name: 'Manager',
    emoji: '📊',
    description: 'ESG managers responsible for day-to-day management and reporting across ESG categories',
    color: 'blue'
  },
  [USER_ROLES.OPERATIONS]: {
    name: 'Operations',
    emoji: '⚙️',
    description: 'Operations team members focused on data entry and basic ESG operations',
    color: 'green'
  }
};

export function hasPermission(userRole: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
}

export function getUserRoleDescription(role: UserRole) {
  return ROLE_DESCRIPTIONS[role];
}

export function getAllPermissionsForRole(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}