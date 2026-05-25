import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast ,{Toaster} from "react-hot-toast";
import "./ForgotPassword.css";
import { FcLock } from "react-icons/fc";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setEmail("");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="fp-page">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="fp-card">
        <div className="fp-icon-wrap"><FcLock /></div>
        <h1 className="fp-title">Forgot password?</h1>
        <p className="fp-subtitle">Enter your email and we'll send you a reset link.</p>

        <form onSubmit={handleSubmit}>
          <label className="fp-label">Email address</label>
          <input
            className="fp-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="fp-btn-primary" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <button className="fp-btn-secondary" onClick={() => navigate("/login")}>
          ← Back to login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;