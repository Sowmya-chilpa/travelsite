import { useEffect, useState } from "react";
import { useWishlist } from "../context/Wishlistcontext";
import { FiHeart } from "react-icons/fi";
import { AiFillHeart } from "react-icons/ai";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";

export const PackageCard = ({ item }) => {
    const [imgSrc, setImgSrc] = useState("https://placehold.co/400x220");
    const { isWishlisted, toggleWishlist } = useWishlist();
    const wishlisted = isWishlisted(item.packagetitle);

    useEffect(() => {
        if (!item.coverimage?._path) return;
        fetch(`${AEM_HOST}${item.coverimage._path}`, {
            headers: {
                Authorization: "Basic " + btoa("admin:admin"),
                "ngrok-skip-browser-warning": "true",
            },
        })
            .then((r) => r.blob())
            .then((blob) => setImgSrc(URL.createObjectURL(blob)));
    }, [item.coverimage]);

    const handleWishlist = (e) => {
        e.stopPropagation();
        toggleWishlist({
            packagetitle: item.packagetitle,
            category: item.category,
            duration: item.duration,
            priceperperson: item.priceperperson,
            shortdescription: item.shortdescription?.plaintext || "",
            coverImagePath: item.coverimage?._path || "",
        });
    };

    return (
        <div className="package-container-card">
            <div className="package-container-card-img">
                <img src={imgSrc} alt={item.packagetitle} />
                <span className="package-container-badge">{item.duration}</span>

                <button
                    onClick={handleWishlist}
                    className={`wishlist-heart-btn ${wishlisted ? "wishlisted" : ""}`}
                    title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
                >
                    {wishlisted
                        ? <AiFillHeart size={18} color="#e53e3e" />
                        : <FiHeart size={18} color="#9ca3af" />
                    }
                </button>
            </div>

            <div className="package-container-card-body">
                <h3>{item.packagetitle}</h3>
                <p className="package-container-desc">
                    {item.shortdescription?.plaintext}
                </p>
                <div className="package-container-card-footer">
                    <span className="package-container-price">₹{item.priceperperson}</span>
                    <button>Explore</button>
                </div>
            </div>
        </div>
    );
};