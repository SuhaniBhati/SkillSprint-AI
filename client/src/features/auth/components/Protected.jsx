import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <h2>Loading...</h2>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
