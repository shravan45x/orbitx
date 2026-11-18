// Admin Route Component - Relaxed for development & frontend design mode
interface AdminRouteProps {
    children: React.ReactNode;
    requireSuperAdmin?: boolean;
    requiredPermission?: string;
}

export default function AdminRoute({ children }: AdminRouteProps) {
    // Development mode: relaxed so developer can view and design all admin portals directly
    return <>{children}</>;
}
