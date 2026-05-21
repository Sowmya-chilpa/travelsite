import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import "./Auth.css";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [aemData, setAemData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const API_URL = "https://travelsite-o5le.onrender.com/api/auth";

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

            loginsubtitle {
              plaintext
            }

            signuptitle

            signupsubtitle {
              plaintext
            }

            herotitle {
              plaintext
            }

            herosubtitle {
              plaintext
            }

            cardtitle

            carddescription {
              plaintext
            }

            authimage {
              ... on ImageRef {
                _path
              }
            }
          }
        }
      }
      `
      })
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
            .then((blob) => {
              const localImage = URL.createObjectURL(blob);
              setImageUrl(localImage);
            });
        }
      })
      .catch((err) => console.log(err));

  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === "signup") {
        if (
          formData.password !==
          formData.confirmPassword
        ) {
          toast.error("Passwords do not match");
          setLoading(false);
          return;
        }
        const res = await fetch(
          `${API_URL}/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              first_name: formData.first_name,
              last_name: formData.last_name,
              email: formData.email,
              phone_number: formData.phone_number,
              password: formData.password,
            }),
          }
        );
        const data = await res.json();
        toast.success(data.message);
        if (res.ok) {

          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            password: "",
            confirmPassword: "",
          });
          setTimeout(() => {
            setActiveTab("login");
          }, 0);
        }
      }
      else {
        const res = await fetch(
          `${API_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
            }),
          }
        );
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem(
            "token",
            data.token
          );
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );
          toast.success("Login Successful");
          setTimeout(() => {
            navigate("/profile");
          }, 1000);
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

  if (!aemData) {
    return <p>Loading...</p>;
  }

  return (
    <div className="auth-page">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-logo">
            <h2>{aemData.logotext}</h2>
            <p>Explore More. Experience Life.</p>
          </div>
          <div className="auth-tabs">
            <button
              className={activeTab === "signup" ? "active" : ""}
              onClick={() => { setActiveTab("signup") }}
            >
              Sign Up
            </button>
            <button
              className={activeTab === "login" ? "active" : ""}
              onClick={() => { setActiveTab("login") }}
            >
              Log In
            </button>
          </div>
          <div className="auth-content">
            <h1>
              {activeTab === "login"
                ? aemData.logintitle
                : aemData.signuptitle}
            </h1>
            <div className="auth-subtitle">
              {activeTab === "login"
                ? aemData.loginsubtitle?.plaintext
                : aemData.signupsubtitle?.plaintext}
            </div >
            <form
              className="auth-form"
              onSubmit={handleSubmit}
            >
              {activeTab === "signup" && (
                <div className="name-row">

                  <input
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    onChange={handleChange}
                    value={formData.first_name}
                  />

                  <input
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    onChange={handleChange}
                    value={formData.last_name}
                  />

                </div>
              )}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                onChange={handleChange}
                value={formData.email}
              />
              {activeTab === "signup" && (
                <input
                  type="text"
                  name="phone_number"
                  placeholder="Phone Number"
                  onChange={handleChange}
                  value={formData.phone_number}
                />
              )}
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={formData.password}
              />
              {activeTab === "signup" && (
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  value={formData.confirmPassword}
                />
              )}
              <div className="auth-options">
                {activeTab === "login" && (
                  <span className="forgot">
                    Forgot Password?
                  </span>
                )}
              </div>
              <button
                className="auth-btn"
                type="submit"
              >
                {loading
                  ? "Please wait..."
                  : activeTab === "login"
                    ? "Login"
                    : "Let's Start"}
              </button>
            </form>
          </div>
        </div>
        <div className="auth-right" style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
          <div className="auth-overlay"></div>
          <div className="travel-card">
            <h3>{aemData.cardtitle}</h3>
            <p>
              {aemData.carddescription?.plaintext}
            </p>
          </div>
          <div className="travel-text">
            <h1>
              {aemData.herotitle?.plaintext}
            </h1>
            <p>
              {aemData.herosubtitle?.plaintext}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;