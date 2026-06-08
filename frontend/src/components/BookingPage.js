import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './BookingPage.css';

const PAYMENT_OPTIONS = [
    { value: "UPI", label: "UPI" },
    { value: "Credit Card", label: " Credit" },
    { value: "Debit Card", label: " Debit" },
    { value: "Net Banking", label: " Net Bank" },
];

const BookingPage = () => {
    const location = useLocation();
    const packageData = location.state;

    const [travellers, setTravellers] = useState(1);
    const [travelDate, setTravelDate] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("UPI");

    const API_URL = process.env.REACT_APP_API_URL;
    const user = JSON.parse(localStorage.getItem("user"));
    const [phone, setPhone] = useState(user?.phone_number || "");
    const navigate = useNavigate();
    const totalAmount = packageData.amount * travellers;

    const formattedDate = travelDate
        ? new Date(travelDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : "—";

    const handleConfirmBooking = async () => {
        if (!travelDate) { alert("Please select a travel date"); return; }
        if (!phone) { alert("Please enter your phone number"); return; }

        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/bookings/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                packageName: packageData.packageName,
                amount: totalAmount,
                travellers,
                travelDate,
                phone,
                paymentMethod,
            }),
        });

        const data = await res.json();
        if (res.ok) {
            alert("Booking Confirmed! ");
            navigate("/profile");
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="bp-page">
            <div className="bp-card">

                <div className="bp-header">
                    <div>
                        <div className="bp-header-title">Complete your booking</div>
                        <div className="bp-header-sub">Review your trip details and confirm</div>
                    </div>
                    <div className="bp-header-step">Step 1 of 1</div>
                </div>

                <div className="bp-body">

                    <div className="bp-left">
                        <p className="bp-section-label">Trip details</p>

                        <div className="bp-pkg-box">
                            <div className="bp-pkg-name">{packageData.packageName}</div>
                            <div className="bp-pkg-price">₹{Number(packageData.amount).toLocaleString("en-IN")} per person</div>
                        </div>

                        <div className="bp-row">
                            <div className="bp-field">
                                <label className="bp-label">Travellers</label>
                                <div className="bp-counter">
                                    <button onClick={() => setTravellers((p) => Math.max(1, p - 1))}>−</button>
                                    <span>{travellers}</span>
                                    <button onClick={() => setTravellers((p) => p + 1)}>+</button>
                                </div>
                            </div>

                            <div className="bp-field">
                                <label className="bp-label">Travel date</label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split("T")[0]}
                                    value={travelDate}
                                    onChange={(e) => setTravelDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="bp-field">
                            <label className="bp-label">Phone number</label>
                            <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="bp-field">
                            <label className="bp-label">Payment method</label>
                            <div className="bp-pay-grid">
                                {PAYMENT_OPTIONS.map((opt) => (
                                    <div
                                        key={opt.value}
                                        className={`bp-pay-opt${paymentMethod === opt.value ? " bp-pay-opt--sel" : ""}`}
                                        onClick={() => setPaymentMethod(opt.value)}
                                    >
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bp-right">
                        <p className="bp-section-label">Booking summary</p>

                        <div className="bp-summary">
                            <div className="bp-sum-row">
                                <span>Package</span>
                                <strong>{packageData.packageName}</strong>
                            </div>
                            <div className="bp-sum-row">
                                <span>Travellers</span>
                                <strong>{travellers} {travellers > 1 ? "persons" : "person"}</strong>
                            </div>
                            <div className="bp-sum-row">
                                <span>Date</span>
                                <strong>{formattedDate}</strong>
                            </div>
                            <div className="bp-sum-row">
                                <span>Payment</span>
                                <strong>{paymentMethod}</strong>
                            </div>
                        </div>

                        <div className="bp-total-row">
                            <span className="bp-total-label">Total</span>
                            <span className="bp-total-amt">₹{Number(totalAmount).toLocaleString("en-IN")}</span>
                        </div>

                        <button
                            className="bp-confirm-btn"
                            disabled={!travelDate || !phone}
                            onClick={handleConfirmBooking}
                        >
                            Confirm booking
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookingPage;