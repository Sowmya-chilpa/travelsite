import { GrLocationPin } from "react-icons/gr";
import "./Profile.css";
import { RiFlightTakeoffLine } from "react-icons/ri";
import { FcGlobe } from "react-icons/fc";
import { IoIosHeart, IoIosNotificationsOutline, IoMdPeople } from "react-icons/io";
import { FaStar, FaTrophy } from "react-icons/fa";
import { MdOutlinePrivacyTip, MdPayment, MdPerson } from "react-icons/md";
import { CiHeadphones, CiLock } from "react-icons/ci";
import { HiOutlineBadgeCheck } from "react-icons/hi";

const Profile = () => {
  return (
    <div className="profile-page">
      <section
        className="hero-section"
        style={{
          backgroundImage:
            `url("https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1400")`,
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-left">
            <div className="profile-image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"
                alt="profile"
                className="profile-image"
              />
            </div>
            <div className="hero-info">
              <h1>Sowmya Chilpa</h1>
              <p className="role">Adventure Explorer</p>
              <div className="meta-row">
                <span><GrLocationPin/> Hyderabad, India</span>
                <span>Member since Jan 2024</span>
              </div>
              <p className="bio">
                Love exploring new places, meeting new people and collecting beautiful memories.
              </p>
              <button className="edit-btn">Edit Profile</button>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><RiFlightTakeoffLine style={{color:"blue"}}/></div>
          <div><h2>12</h2><p>Trips Completed</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FcGlobe /></div>
          <div><h2>5</h2><p>Countries Explored</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><IoIosHeart style={{color:"red"}}/></div>
          <div><h2>18</h2><p>Wishlist Packages</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaStar style={{color:"gold"}}/></div>
          <div><h2>24</h2><p>Reviews Shared</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FaTrophy style={{color:"blue"}}/></div>
          <div><h2>1,250</h2><p>Wanderer Points</p></div>
        </div>
      </section>

      <div className="main-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Upcoming Trips</h3>
            <button>View all bookings →</button>
          </div>
          <div className="trip-item">
            <img src="https://images.unsplash.com/photo-1526481280695-3c4691ecc8f7?q=80&w=600" alt="" />
            <div className="trip-info">
              <h4>Japan Cultural Tour</h4>
              <p>24 May – 31 May 2025</p>
              <p className="trip-travelers"><IoMdPeople style={{color:"black"}}/> 2 Travelers</p>
            </div>
            <span className="status confirmed">Confirmed</span>
          </div>
          <div className="trip-item">
            <img src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600" alt="" />
            <div className="trip-info">
              <h4>Goa Beach Escape</h4>
              <p>10 Jun – 15 Jun 2025</p>
              <p className="trip-travelers"><IoMdPeople style={{color:"black"}}/> 3 Travelers</p>
            </div>
            <span className="status pending">Pending</span>
          </div>
          <div className="trip-item">
            <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600" alt="" />
            <div className="trip-info">
              <h4>Manali Snow Trek</h4>
              <p>05 Jun – 10 Jul 2025</p>
              <p className="trip-travelers"><MdPerson style={{color:"black"}}/> 1 Traveler</p>
            </div>
            <span className="status confirmed">Confirmed</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Wishlist</h3>
            <button>View all →</button>
          </div>
          <div className="wishlist-item">
            <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600" alt="" />
            <div className="wishlist-info">
              <h4>Bali Exotic Getaway</h4>
              <p>₹62,000 / person</p>
            </div>
            <span className="heart"><IoIosHeart style={{color:"red"}}/></span>
          </div>
          <div className="wishlist-item">
            <img src="https://images.unsplash.com/photo-1505765050516-f72dcac9c60b?q=80&w=600" alt="" />
            <div className="wishlist-info">
              <h4>Santorini Island Tour</h4>
              <p>₹85,000 / person</p>
            </div>
            <span className="heart"><IoIosHeart style={{color:"red"}}/></span>
          </div>
          <div className="wishlist-item">
            <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?q=80&w=600" alt="" />
            <div className="wishlist-info">
              <h4>Switzerland Highlights</h4>
              <p>₹1,25,000 / person</p>
            </div>
            <span className="heart"><IoIosHeart style={{color:"red"}}/></span>
          </div>
        </div>
      </div>

      <div className="main-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recently Viewed</h3>
            <button>View all →</button>
          </div>
          <div className="recent-grid">
            <div className="recent-card">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=600" alt="" />
              <h4>Kerala Backwaters</h4>
              <p>₹28,000 / person</p>
              <span>4 Nights • 5 Days</span>
            </div>
            <div className="recent-card">
              <img src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=600" alt="" />
              <h4>Ladakh Adventure</h4>
              <p>₹32,000 / person</p>
              <span>6 Nights • 7 Days</span>
            </div>
            <div className="recent-card">
              <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600" alt="" />
              <h4>Dubai City Experience</h4>
              <p>₹45,000 / person</p>
              <span>3 Nights • 4 Days</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Booking History</h3>
            <button>View all →</button>
          </div>
          <table className="booking-table">
            <thead>
              <tr>
                <th>Package</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Thailand Paradise</td>
                <td>12 Jan 2025</td>
                <td>₹48,000</td>
                <td><span className="table-status completed">Completed</span></td>
              </tr>
              <tr>
                <td>Rajasthan Heritage</td>
                <td>20 Dec 2024</td>
                <td>₹22,000</td>
                <td><span className="table-status completed">Completed</span></td>
              </tr>
              <tr>
                <td>Andaman Escape</td>
                <td>05 Nov 2024</td>
                <td>₹36,500</td>
                <td><span className="table-status completed">Completed</span></td>
              </tr>
              <tr>
                <td>Singapore Explorer</td>
                <td>18 Oct 2024</td>
                <td>₹55,000</td>
                <td><span className="table-status cancelled">Cancelled</span></td>
              </tr>
              <tr>
                <td>Maldives Retreat</td>
                <td>30 Aug 2024</td>
                <td>₹75,000</td>
                <td><span className="table-status completed">Completed</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bottom-grid">
        <div className="dashboard-card settings-card">
          <h3>Account Settings</h3>
          <ul className="settings-list">
            <li className="active-setting"><MdPerson style={{color:"black"}}/> Personal Information</li>
            <li><CiLock /> Password &amp; Security</li>
            <li><IoIosNotificationsOutline /> Notifications</li>
            <li><MdPayment />Payment Methods</li>
            <li><GrLocationPin/> Address Book</li>
            <li><FcGlobe /> Language &amp; Currency</li>
            <li><MdOutlinePrivacyTip /> Privacy &amp; Preferences</li>
          </ul>
        </div>

        <div className="dashboard-card personal-card">
          <div className="card-header">
            <h3>Personal Information</h3>
            <button>Edit</button>
          </div>
          <div className="personal-grid">
            <div className="info-group">
              <label>Full Name</label>
              <p>Sowmya Chilpa</p>
            </div>
            <div className="info-group">
              <label>Email Address</label>
              <p>sowmya@example.com</p>
            </div>
            <div className="info-group">
              <label>Phone Number</label>
              <p>+91 98765 43210</p>
            </div>
            <div className="info-group">
              <label>Date of Birth</label>
              <p>12 March 1998</p>
            </div>
            <div className="info-group">
              <label>Nationality</label>
              <p>Indian</p>
            </div>
            <div className="info-group">
              <label>Gender</label>
              <p>Female</p>
            </div>
          </div>
        </div>
      </div>

      <section className="feature-grid">
        <div className="feature-card"><CiHeadphones /> 24/7 Support<br /><span style={{ fontWeight: 400, fontSize: '10px', color: '#9ca3af' }}>We're here to help you anytime</span></div>
        <div className="feature-card"><HiOutlineBadgeCheck /> Best Price Guarantee<br /><span style={{ fontWeight: 400, fontSize: '10px', color: '#9ca3af' }}>Get the best deals always</span></div>
        <div className="feature-card"><MdPayment /> Secure Payments<br /><span style={{ fontWeight: 400, fontSize: '10px', color: '#9ca3af' }}>100% secure and safe</span></div>
        <div className="feature-card"><FaStar style={{color:"gold"}}/> Trusted by Travelers<br /><span style={{ fontWeight: 400, fontSize: '10px', color: '#9ca3af' }}>4.9/5 from 10,000+ reviews</span></div>
      </section>

    </div>
  );
};

export default Profile;