import { useNavigate } from "react-router-dom";
import Signup from "../components/auth/Signup";

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <Signup
      onSuccess={() => navigate("/requests")}
      onSwitchToLogin={() => navigate("/login")}
    />
  );
}
