import { useStore } from "./store";

export type Permission =
  | "dashboard.view"
  | "orders.view"
  | "orders.edit"
  | "chats.view"
  | "chats.reply"
  | "products.view"
  | "products.edit"
  | "customers.view"
  | "customers.edit"
  | "payments.view"
  | "payments.edit"
  | "content.view"
  | "content.edit"
  | "reports.view"
  | "settings.edit"
  | "staff.view"
  | "staff.edit";

// We'll extend UserRole type slightly if needed, or map existing "staff" | "admin" to roles.
// Since User model has `role: "admin" | "customer" | "staff"`, let's add `staffRole` to User, 
// but for now, we'll map permissions based on `role`. If it's `admin`, super_admin. If it's `staff`, 
// maybe they have a `permissions` array or a `staffRole` property. We will mock it using `staffRole` property.

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  super_admin: [
    "dashboard.view", "orders.view", "orders.edit", "chats.view", "chats.reply",
    "products.view", "products.edit", "customers.view", "customers.edit",
    "payments.view", "payments.edit", "content.view", "content.edit",
    "reports.view", "settings.edit", "staff.view", "staff.edit"
  ],
  order_manager: [
    "dashboard.view", "orders.view", "orders.edit", "chats.view", "chats.reply", "customers.view"
  ],
  production: [
    "dashboard.view", "orders.view", "orders.edit" // limited to updating order status
  ],
  content_editor: [
    "dashboard.view", "products.view", "products.edit", "content.view", "content.edit"
  ],
  accountant: [
    "dashboard.view", "orders.view", "payments.view", "payments.edit", "reports.view"
  ]
};

export function checkPermission(user: any, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === "admin") return true; // admin has all permissions
  if (user.role === "staff") {
     // Mock resolving staff role. Let's assume user.staffRole exists, default to 'order_manager'
     const role = user.staffRole || "order_manager";
     return ROLE_PERMISSIONS[role]?.includes(permission) || false;
  }
  return false;
}

export function usePermission(permission: Permission) {
  const { user } = useStore();
  return checkPermission(user, permission);
}

export function Can({ perm, children, fallback = null }: { perm: Permission, children: React.ReactNode, fallback?: React.ReactNode }) {
  const hasPerm = usePermission(perm);
  return hasPerm ? <>{children}</> : <>{fallback}</>;
}
