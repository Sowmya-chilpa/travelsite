//whishlistcontext.js
import { createContext, useContext, useEffect, useState } from "react";

const BACKEND = "http://localhost:5000";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);

    const getToken = () => localStorage.getItem("token");

    const fetchWishlist = async () => {
        const token = getToken();
        if (!token) return;
        try {
            const res = await fetch(`${BACKEND}/api/wishlist`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setWishlist(data.items || []);
        } catch (err) {
            console.error("Failed to fetch wishlist", err);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const isWishlisted = (packagetitle) =>
        wishlist.some((item) => item.packagetitle === packagetitle);

    const addToWishlist = async (packageData) => {
        const token = getToken();
        if (!token) return alert("Please login to save to wishlist");

        try {
            const res = await fetch(`${BACKEND}/api/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(packageData),
            });
            const data = await res.json();
            if (res.ok) {
                setWishlist((prev) => [...prev, data.item]);
            }
        } catch (err) {
            console.error("Add to wishlist failed", err);
        }
    };

    const removeFromWishlist = async (packagetitle) => {
        const token = getToken();
        if (!token) return;

        try {
            const res = await fetch(
                `${BACKEND}/api/wishlist/${encodeURIComponent(packagetitle)}`,
                {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if (res.ok) {
                setWishlist((prev) =>
                    prev.filter((item) => item.packagetitle !== packagetitle)
                );
            }
        } catch (err) {
            console.error("Remove from wishlist failed", err);
        }
    };

    const toggleWishlist = (packageData) => {
        if (isWishlisted(packageData.packagetitle)) {
            removeFromWishlist(packageData.packagetitle);
        } else {
            addToWishlist(packageData);
        }
    };

    return (
        <WishlistContext.Provider
            value={{ wishlist, isWishlisted, toggleWishlist, fetchWishlist, removeFromWishlist }}        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);