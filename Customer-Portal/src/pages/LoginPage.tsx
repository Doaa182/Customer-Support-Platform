import { useNavigate } from "react-router-dom";
import Login from "../components/auth/Login/Login";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <Login
      onSuccess={() => navigate("/requests")}
      onSwitchToSignup={() => navigate("/signup")}
    />
  );
}
