// The /admin/login page doesn't use the protected admin layout.
// This file ensures the login page is a standalone route without
// the AdminSidebar wrapper that the parent /admin layout provides.
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
