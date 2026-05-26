//wishilst.jsx

import { useEffect, useState } from "react";
import "./Wishlist.css";
import { useWishlist } from "../context/Wishlistcontext";

const AEM_HOST = process.env.REACT_APP_AEM_HOST;

const WishlistCard = ({ item }) => {
    const { removeFromWishlist } = useWishlist() || {};
    const [imgSrc, setImgSrc] = useState("https://placehold.co/400x220");

    useEffect(() => {
        if (!item.coverImagePath) return;
        fetch(`${AEM_HOST}${item.coverImagePath}`, {
            headers: {
                Authorization: "Basic " + btoa("admin:admin"),
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then((r) => r.blob())
            .then((blob) => setImgSrc(URL.createObjectURL(blob)))
            .catch(() => { });
    }, [item.coverImagePath]);

    const handleRemove = () => {
        if (removeFromWishlist) removeFromWishlist(item.packagetitle);
    };

    return (
        <div className="wl-card">
            <div className="wl-card-img">
                <img src={imgSrc} alt={item.packagetitle} />
                <span className="wl-badge">{item.duration}</span>
                <span className="wl-category">{item.category}</span>
            </div>
            <div className="wl-card-body">
                <h3>{item.packagetitle}</h3>
                <p>{item.shortdescription}</p>
                <div className="wl-card-footer">
                    <span className="wl-price">₹{item.priceperperson}</span>
                    <div className="wl-actions">
                        <button className="wl-btn-explore">Explore</button>
                        <button className="wl-btn-remove" onClick={handleRemove}>
                            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Wishlist = () => {
    const { wishlist } = useWishlist();

    return (
        <div className="wl-container">
            <div className="wl-header">
                <h2>My Wishlist</h2>
                <p>
                    {wishlist.length > 0
                        ? `${wishlist.length} saved journey${wishlist.length > 1 ? "s" : ""}`
                        : "No saved journeys yet"}
                </p>
            </div>

            {wishlist.length === 0 ? (
                <div className="wl-empty">
                    <div className="wl-empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                    </div>
                    <h3>Your wishlist is empty</h3>
                    <p>Start exploring packages and save the ones you love!</p>
                    <a href="/packages" className="wl-browse-btn">Browse Packages</a>
                </div>
            ) : (
                <div className="wl-grid">
                    {wishlist.map((item, index) => (
                        <WishlistCard key={item._id || index} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;