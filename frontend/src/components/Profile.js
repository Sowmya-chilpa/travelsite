import { GrLocationPin } from "react-icons/gr";
import "./Profile.css";
import { RiFlightTakeoffLine } from "react-icons/ri";
import { FcGlobe } from "react-icons/fc";
import { IoIosHeart, IoIosNotificationsOutline, IoMdPeople } from "react-icons/io";
import { FaStar, FaTrophy } from "react-icons/fa";
import { MdOutlinePrivacyTip, MdPayment, MdPerson } from "react-icons/md";
import { CiHeadphones, CiLock } from "react-icons/ci";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { useWishlist } from "../context/Wishlistcontext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

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

  useEffect(() => {

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res =await fetch(`${API_URL}/bookings/my-bookings`,
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
      const res =await fetch(`${API_URL}/bookings/cancel/${bookingId}`,
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

      <section className="profile-stats-grid">
        <div className="profile-stat-card">
          <div className="profile-stat-icon"><RiFlightTakeoffLine style={{ color: "blue" }} /></div>
          <div><h2>12</h2><p>Trips Completed</p></div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-icon"><FcGlobe /></div>
          <div><h2>5</h2><p>Countries Explored</p></div>
        </div>
        <Link to="/wishlist">
          <div className="profile-stat-card">
            <div className="profile-stat-icon"><IoIosHeart style={{ color: "red" }} /></div>
            <div><h2>{wishlist.length}</h2><p>Wishlist Packages</p></div>
          </div>
        </Link>

        <div className="profile-stat-card">
          <div className="profile-stat-icon"><FaStar style={{ color: "gold" }} /></div>
          <div><h2>24</h2><p>Reviews Shared</p></div>
        </div>
        <div className="profile-stat-card">
          <div className="profile-stat-icon"><FaTrophy style={{ color: "blue" }} /></div>
          <div><h2>1,250</h2><p>Wanderer Points</p></div>
        </div>
      </section>

      <div className="profile-main-grid">
        <div className="profile-dashboard-card">
          <div className="profile-card-header">
            <h3>Upcoming Trips</h3>
            <button>View all bookings →</button>
          </div>
          <div className="profile-trip-item">
            <img src="https://images.unsplash.com/photo-1526481280695-3c4691ecc8f7?q=80&w=600" alt="" />
            <div className="profile-trip-info">
              <h4>Japan Cultural Tour</h4>
              <p>24 May – 31 May 2025</p>
              <p className="profile-trip-travelers"><IoMdPeople style={{ color: "black" }} /> 2 Travelers</p>
            </div>
            <span className="profile-status confirmed">Confirmed</span>
          </div>
          <div className="profile-trip-item">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600" alt="" />
            <div className="profile-trip-info">
              <h4>Goa Beach Escape</h4>
              <p>10 Jun – 15 Jun 2025</p>
              <p className="profile-trip-travelers"><IoMdPeople style={{ color: "black" }} /> 3 Travelers</p>
            </div>
            <span className="profile-status pending">Pending</span>
          </div>
          <div className="profile-trip-item">
            <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600" alt="" />
            <div className="profile-trip-info">
              <h4>Manali Snow Trek</h4>
              <p>05 Jun – 10 Jul 2025</p>
              <p className="profile-trip-travelers"><MdPerson style={{ color: "black" }} /> 1 Traveler</p>
            </div>
            <span className="profile-status confirmed">Confirmed</span>
          </div>
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
            <li className="profile-active-setting"><MdPerson style={{ color: "black" }} /> Personal Information</li>
            <li><CiLock /> Password &amp; Security</li>
            <li><IoIosNotificationsOutline /> Notifications</li>
            <li><MdPayment />Payment Methods</li>
            <li><GrLocationPin /> Address Book</li>
            <li><FcGlobe /> Language &amp; Currency</li>
            <li><MdOutlinePrivacyTip /> Privacy &amp; Preferences</li>
          </ul>
        </div>

        <div className="profile-dashboard-card personal-card">
          <div className="profile-card-header">
            <h3>Personal Information</h3>
            <button>Edit</button>
          </div>
          <div className="profile-personal-grid">
            <div className="profile-info-group">
              <label>Full Name</label>
              <p>Sowmya Chilpa</p>
            </div>
            <div className="profile-info-group">
              <label>Email Address</label>
              <p>sowmya@example.com</p>
            </div>
            <div className="profile-info-group">
              <label>Phone Number</label>
              <p>+91 98765 43210</p>
            </div>
            <div className="profile-info-group">
              <label>Date of Birth</label>
              <p>12 March 1998</p>
            </div>
            <div className="profile-info-group">
              <label>Nationality</label>
              <p>Indian</p>
            </div>
            <div className="profile-info-group">
              <label>Gender</label>
              <p>Female</p>
            </div>
          </div>
        </div>
      </div>

      <section className="profile-feature-grid">
        <div className="profile-feature-card"><CiHeadphones /> 24/7 Support<br /><span style={{ fontWeight: 400, fontSize: '10px', color: '#9ca3af' }}>We're here to help you anytime</span></div>
        <div className="profile-feature-card"><HiOutlineBadgeCheck /> Best Price Guarantee<br /><span style={{ fontWeight: 400, fontSize: '10px', color: '#9ca3af' }}>Get the best deals always</span></div>
        <div className="profile-feature-card"><MdPayment /> Secure Payments<br /><span style={{ fontWeight: 400, fontSize: '10px', color: '#9ca3af' }}>100% secure and safe</span></div>
        <div className="profile-feature-card"><FaStar style={{ color: "gold" }} /> Trusted by Travelers<br /><span style={{ fontWeight: 400, fontSize: '10px', color: '#9ca3af' }}>4.9/5 from 10,000+ reviews</span></div>
      </section>

    </div>
  );
};

export default Profile;