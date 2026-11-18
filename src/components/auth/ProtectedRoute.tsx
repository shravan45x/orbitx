// Protected Route Component - Relaxed for development & frontend design mode
interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    // Development mode: relaxed so developer can view and design dashboard directly without forced login
    return <>{children}</>;
}
