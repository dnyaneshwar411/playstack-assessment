export const SCOPES = [
  // Workspace
  "workspace:view",
  "workspace:update",
  "workspace:delete",
  "workspace:settings:view",
  "workspace:settings:update",

  // Members
  "member:view",
  "member:invite",
  "member:update",
  "member:remove",

  // Permissions
  "scope:view",
  "scope:assign",
  "scope:revoke",

  // Applications
  "application:view",
  "application:create",
  "application:update",
  "application:delete",
  "application:archive",
  "application:restore",

  // Prompts
  "prompt:view",
  "prompt:create",
  "prompt:update",
  "prompt:delete",
  "prompt:publish",
  "prompt:rollback",

  // Executions
  "execution:view",
  "execution:create",
  "execution:cancel",
  "execution:retry",

  // AI Providers
  "provider:view",
  "provider:create",
  "provider:update",
  "provider:delete",

  // API Keys
  "apikey:view",
  "apikey:create",
  "apikey:update",
  "apikey:delete",

  // Usage
  "usage:view",

  // Audit
  "audit:view",
  "audit:export",

  // Notifications
  "notification:view",
  "notification:update",

  // Analytics
  "analytics:view",
  "analytics:export",

  // Billing
  "billing:view",
  "billing:update",
] as const;