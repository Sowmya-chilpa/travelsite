import "./Profile.css";
import { useWishlist } from "../context/Wishlistcontext";
import { useEffect, useState } from "react";
import { IoMdPeople } from "react-icons/io";
import { MdPerson } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { FcLock } from "react-icons/fc";

const WishlistImage = ({ coverImagePath }) => {
  const [imgSrc, setImgSrc] = useState("https://placehold.co/60x48");

  useEffect(() => {
    if (!coverImagePath) return;
    fetch(`${process.env.REACT_APP_AEM_HOST}${coverImagePath}`, {
      headers: {
        Authorization: "Basic " + btoa("admin:admin"),
        "ngrok-skip-browser-warning": "true",
      },
    })
      .then((r) => r.blob())
      .then((blob) => setImgSrc(URL.createObjectURL(blob)))
      .catch(() => { });
  }, [coverImagePath]);

  return <img src={imgSrc} alt="" />;
};

const Profile = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const { wishlist } = useWishlist();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [formData, setFormData] = useState({ first_name: user?.first_name || "", last_name: user?.last_name || "", phone_number: user?.phone_number || "" });
  const [bookings, setBookings] = useState([]);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [activeTab, setActiveTab] = useState("personal");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  useEffect(() => {

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/bookings/my-bookings`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBookings();
  }, [API_URL]);

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/auth/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify(
            formData
          ),
        }
      );

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
        setUser(data.user);
        setIsEditing(false);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelBooking = async (bookingId) => {

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/bookings/cancel/${bookingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();

      if (res.ok) {
        setBookings(
          bookings.map((booking) =>
            booking._id === bookingId
              ? {
                ...booking,
                status: "Cancelled",
              }
              : booking
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangePassword =
    async () => {

      if (
        passwordData.currentPassword ===
        passwordData.newPassword
      ) {
        return alert(
          "New password must be different from current password"
        );
      }

      if (
        passwordData.newPassword !==
        passwordData.confirmPassword
      ) {
        return alert(
          "Passwords do not match"
        );
      }

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const res = await fetch(
          `${API_URL}/auth/change-password`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              Authorization:
                `Bearer ${token}`
            },
            body: JSON.stringify({
              currentPassword:
                passwordData.currentPassword,
              newPassword:
                passwordData.newPassword
            })
          }
        );

        const data = await res.json();

        if (res.ok) {

          alert(data.message);

          const updatedUser = {
            ...user,
            passwordChangedAt: new Date()
          };

          setUser(updatedUser);

          localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
          );

          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
          });

          setShowPasswordModal(false);

        } else {
          alert(data.message);
        }

      } catch (error) {
        console.log(error);
      }
    };

  return (
    <div className="profile-page">
      <section
        className="profile-hero-section"
        style={{
          backgroundImage:
            `url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400")`,
        }}
      >
        <div className="profile-hero-overlay" />
        <div className="profile-hero-content">
          <div className="profile-hero-left">
            <div className="profile-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"
                alt="profile"
                className="profile-image"
              />
            </div>
            <div className="profile-hero-info">
              <h1>{user?.first_name}{" "}{user?.last_name}</h1>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-meta-row">
                {user?.phone_number}
              </div>
              <button className="profile-edit-btn" onClick={() => setIsEditing(!isEditing)}>Edit Profile</button>
              {
                isEditing && (
                  <div className="profile-edit-modal-overlay">
                    <div className="profile-edit-modal">
                      <h2>Edit Profile</h2>
                      <input
                        type="text"
                        placeholder="First Name"
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            first_name:
                              e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_name:
                              e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={formData.phone_number}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone_number:
                              e.target.value,
                          })
                        }
                      />
                      <div className="profile-modal-buttons">
                        <button
                          className="profile-save-btn"
                          onClick={handleUpdateProfile}
                        >
                          Save Changes
                        </button>
                        <button
                          className="profile-cancel-btn"
                          onClick={() =>
                            setIsEditing(false)
                          }
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </section>

      <div className="profile-main-grid">
        <div className="profile-dashboard-card">
          <div className="profile-card-header">
            <h3>Upcoming Trips</h3>
            <button>View all bookings →</button>
          </div>

          {bookings.filter(
            (booking) =>
              booking.status !== "Cancelled"
          ).length === 0 ? (
            <p>No upcoming trips</p>
          ) : (
            bookings
              .filter(
                (booking) =>
                  booking.status !== "Cancelled"
              )
              .map((booking) => (
                <div
                  className="profile-trip-item"
                  key={booking._id}
                >
                  <div className="profile-trip-info">
                    <h4>{booking.packageName}</h4>

                    <p>
                      {new Date(
                        booking.travelDate
                      ).toLocaleDateString()}
                    </p>

                    <p className="profile-trip-travelers">
                      <IoMdPeople /> {booking.travellers} Traveller
                      {booking.travellers > 1 ? "s" : ""}
                    </p>
                  </div>

                  <span className="profile-status confirmed">
                    {booking.status}
                  </span>
                </div>
              ))
          )}
        </div>

        <div className="profile-dashboard-card">
          <div className="profile-dashboard-card">
            <div className="profile-card-header">
              <h3>My Wishlist</h3>
              <button>View all →</button>
            </div>

            {wishlist.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "13px" }}>No saved journeys yet</p>
            ) : (
              wishlist.map((item, index) => (
                <div className="profile-trip-item" key={item._id || index}>
                  <WishlistImage coverImagePath={item.coverImagePath} />
                  <div className="profile-trip-info">
                    <h4>{item.packagetitle}</h4>
                    <p>₹{item.priceperperson} / person</p>
                    <p className="profile-trip-travelers">{item.duration}</p>
                  </div>
                  <span className="profile-status confirmed">Saved</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="profile-main-grid">
        <div className="profile-dashboard-card">
          <div className="profile-card-header">
            <h3>Recently Viewed</h3>
            <button>View all →</button>
          </div>
          <div className="profile-recent-grid">
            <div className="profile-recent-card">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600" alt="" />
              <h4>Kerala Backwaters</h4>
              <p>₹28,000 / person</p>
              <span>4 Nights • 5 Days</span>
            </div>
            <div className="profile-recent-card">
              <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600" alt="" />
              <h4>Ladakh Adventure</h4>
              <p>₹32,000 / person</p>
              <span>6 Nights • 7 Days</span>
            </div>
            <div className="profile-recent-card">
              <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600" alt="" />
              <h4>Dubai City Experience</h4>
              <p>₹45,000 / person</p>
              <span>3 Nights • 4 Days</span>
            </div>
          </div>
        </div>

        <div className="profile-dashboard-card">
          <div className="profile-card-header">
            <h3>Booking History</h3>
            <button>View all →</button>
          </div>
          <div className="profile-booking-table-wrapper">
            <table className="profile-booking-table">
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.packageName}</td>

                    <td>
                      {new Date(
                        booking.bookingDate
                      ).toLocaleDateString()}
                    </td>

                    <td>
                      ₹{booking.amount}
                    </td>

                    <td>
                      <span
                        className={`profile-table-status ${booking.status === "Cancelled"
                          ? "cancelled"
                          : "completed"
                          }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td>{booking.paymentMethod}</td>
                    <td>
                      {
                        booking.status !== "Cancelled" && (
                          <button
                            className="cancel-booking-btn"
                            onClick={() =>
                              handleCancelBooking(
                                booking._id
                              )
                            }
                          >
                            Cancel
                          </button>
                        )
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="profile-bottom-grid">
        <div className="profile-dashboard-card profile-settings-card">
          <h3>Account Settings</h3>
          <ul className="profile-settings-list">
            <li
              className={
                activeTab === "personal"
                  ? "profile-active-setting"
                  : ""
              }
              onClick={() => setActiveTab("personal")}
            >
              <MdPerson /> Personal Information
            </li>

            <li
              className={
                activeTab === "password"
                  ? "profile-active-setting"
                  : ""
              }
              onClick={() => setActiveTab("password")}
            >
              <CiLock /> Password & Security
            </li>
          </ul>
        </div>

        {activeTab === "personal" && (
          <div className="profile-dashboard-card personal-card">
            <div className="profile-card-header">
              <h3>Personal Information</h3>
            </div>
            <div className="profile-personal-grid">
              <div className="profile-info-group">
                <label>Full Name</label>
                <p>{user?.first_name} {user?.last_name}</p>
              </div>
              <div className="profile-info-group">
                <label>Email Address</label>
                <p>{user?.email}</p>
              </div>
              <div className="profile-info-group">
                <label>Phone Number</label>
                <p>{user?.phone_number}</p>
              </div>
            </div>
          </div>)}
        {activeTab === "password" && (
          <>
            <div className="profile-dashboard-card personal-card">
              <div className="profile-card-header">
                <h3><span><FcLock /></span>Security Center</h3>
              </div>

              <div >
                <p>
                  <strong>Last Password Update:</strong>{" "}
                  {user?.passwordChangedAt
                    ? new Date(user.passwordChangedAt).toLocaleDateString()
                    : "Not Available"}
                </p>

                <button
                  className="profile-edit-btn"
                  style={{ backgroundColor: "#4c7388", color: "white" }}
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </button>
              </div>
            </div>

            {showPasswordModal && (
              <div className="profile-edit-modal-overlay">
                <div className="profile-edit-modal">
                  <h2>Change Password</h2>

                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword:
                          e.target.value,
                      })
                    }
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword:
                          e.target.value,
                      })
                    }
                  />

                  <div className="profile-modal-buttons">
                    <button
                      className="profile-save-btn"
                      onClick={handleChangePassword}
                    >
                      Update Password
                    </button>

                    <button
                      className="profile-cancel-btn"
                      onClick={() => {
                        setShowPasswordModal(false);

                        setPasswordData({
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;