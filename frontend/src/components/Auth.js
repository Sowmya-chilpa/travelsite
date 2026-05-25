import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./Auth.css";

const AEM_HOST = process.env.REACT_APP_AEM_HOST;

const emptyForm = {
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  password: "",
  confirmPassword: "",
};

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [aemData, setAemData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (activeTab === "signup") {
      if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
      if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";

      if (!formData.phone_number.trim()) {
        newErrors.phone_number = "Phone number is required";
      } else if (!phoneRegex.test(formData.phone_number)) {
        newErrors.phone_number = "Enter a valid 10-digit phone number";
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  useEffect(() => {
    fetch(`${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("admin:admin"),
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        query: `
        {
          authpagemodelList {
            items {
              logotext
              logintitle
              loginsubtitle { plaintext }
              signuptitle
              signupsubtitle { plaintext }
              herotitle { plaintext }
              herosubtitle { plaintext }
              cardtitle
              carddescription { plaintext }
              authimage {
                ... on ImageRef {
                  _path
                }
              }
            }
          }
        }
        `,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        const item = resData.data.authpagemodelList.items[0];
        setAemData(item);
        if (item.authimage?._path) {
          fetch(`${AEM_HOST}${item.authimage._path}`, {
            headers: {
              Authorization: "Basic " + btoa("admin:admin"),
              "ngrok-skip-browser-warning": "true",
            },
          })
            .then((res) => res.blob())
            .then((blob) => setImageUrl(URL.createObjectURL(blob)));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (activeTab === "signup") {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            phone_number: formData.phone_number,
            password: formData.password,
          }),
        });
        const data = await res.json();
        toast.success(data.message);
        if (res.ok) {
          handleTabSwitch("login");
        }
      } else {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          toast.success("Login Successful");
          setTimeout(() => navigate("/profile"), 1000);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };

  if (!aemData) return <p>Loading...</p>;

  return (
    <div className="auth-page">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-logo">
            <h2>{aemData.logotext}</h2>
            <p>Explore More. Experience Life.</p>
          </div>
          <div className="auth-tabs">
            <button
              className={activeTab === "signup" ? "active" : ""}
              onClick={() => handleTabSwitch("signup")}
            >
              Sign Up
            </button>
            <button
              className={activeTab === "login" ? "active" : ""}
              onClick={() => handleTabSwitch("login")}
            >
              Log In
            </button>
          </div>
          <div className="auth-content">
            <h1>{activeTab === "login" ? aemData.logintitle : aemData.signuptitle}</h1>
            <div className="auth-subtitle">
              {activeTab === "login"
                ? aemData.loginsubtitle?.plaintext
                : aemData.signupsubtitle?.plaintext}
            </div>
            <form className="auth-form" onSubmit={handleSubmit}>
              {activeTab === "signup" && (
                <div className="name-row">
                  <div>
                    <input
                      type="text"
                      name="first_name"
                      placeholder="First Name"
                      onChange={handleChange}
                      value={formData.first_name}
                    />
                    {errors.first_name && <span className="error">{errors.first_name}</span>}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      onChange={handleChange}
                      value={formData.last_name}
                    />
                    {errors.last_name && <span className="error">{errors.last_name}</span>}
                  </div>
                </div>
              )}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                value={formData.email}
              />
              {errors.email && <span className="error">{errors.email}</span>}

              {activeTab === "signup" && (
                <>
                  <input
                    type="text"
                    name="phone_number"
                    placeholder="Phone Number"
                    onChange={handleChange}
                    value={formData.phone_number}
                  />
                  {errors.phone_number && <span className="error">{errors.phone_number}</span>}
                </>
              )}
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
              />
              {errors.password && <span className="error">{errors.password}</span>}

              {activeTab === "signup" && (
                <>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    value={formData.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <span className="error">{errors.confirmPassword}</span>
                  )}
                </>
              )}
              <div className="auth-options">
                {activeTab === "login" && (
                  <span className="forgot" onClick={() => navigate("/forgot-password")}>
                    Forgot Password?
                  </span>
                )}
              </div>
              <button className="auth-btn" type="submit">
                {loading ? "Please wait..." : activeTab === "login" ? "Login" : "Let's Start"}
              </button>
            </form>
          </div>
        </div>
        <div
          className="auth-right"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="auth-overlay"></div>
          <div className="travel-card">
            <h3>{aemData.cardtitle}</h3>
            <p>{aemData.carddescription?.plaintext}</p>
          </div>
          <div className="travel-text">
            <h1>{aemData.herotitle?.plaintext}</h1>
            <p>{aemData.herosubtitle?.plaintext}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;