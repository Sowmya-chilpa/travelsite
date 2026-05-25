import { useState } from "react";
import {useNavigate,useParams,} from "react-router-dom";
import toast from "react-hot-toast";
import "./ForgotPassword.css";

const ResetPassword = () => {

    const [password, setPassword] = useState("");
    const [confirmPassword,setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();
    const API_URL = process.env.REACT_APP_API_URL;
    const handleSubmit =
        async (e) => {
            e.preventDefault();
            if (
                password !== confirmPassword
            ) {
                toast.error(
                    "Passwords do not match"
                );
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(
                    `${API_URL}/auth/reset-password/${token}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json",
                        },
                        body: JSON.stringify({
                            password,
                        }),
                    }
                );
                const data = await res.json();
                if (res.ok) {
                    toast.success(
                        data.message
                    );
                    setTimeout(() => {
                        navigate("/login");
                    }, 1500);

                } else {
                    toast.error(
                        data.message
                    );
                }
            } catch {
                toast.error(
                    "Something went wrong"
                );
            }
            setLoading(false);
        };

    return (

        <div className="fp-page">
            <div className="fp-card">
                <h1 className="fp-title">
                    Reset Password
                </h1>
                <p className="fp-subtitle">
                    Enter your new password
                </p>
                <form onSubmit={handleSubmit}>
                    <input
                        className="fp-input"
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />
                    <input
                        className="fp-input"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                    />
                    <button
                        className="fp-btn-primary"
                        type="submit"
                    >
                        {loading
                            ? "Updating..."
                            : "Reset Password"}

                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;