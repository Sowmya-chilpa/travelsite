import { useState, useEffect, useRef } from "react";
import { FiSearch, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import UserProfile from "../components/UserProfile";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

function AEMImage({ src, alt, style }) {
    const [objectUrl, setObjectUrl] = useState(null);

    useEffect(() => {
        let url;
        fetch(src, {
            headers: {
                "ngrok-skip-browser-warning": "true",
                Authorization: "Basic " + btoa("admin:admin"),
            },
        })
            .then((res) => res.blob())
            .then((blob) => {
                url = URL.createObjectURL(blob);
                setObjectUrl(url);
            })
            .catch(console.error);

        return () => { if (url) URL.revokeObjectURL(url); };
    }, [src]);

    if (!objectUrl) return (
        <div style={{ width: "clamp(40px, 8vw, 60px)", height: "clamp(28px, 5vw, 40px)", background: "#eee", borderRadius: 4 }} />
    );

    return (
        <img
            src={objectUrl}
            alt={alt}
            style={{
                maxWidth: "100%",
                height: "auto",
                objectFit: "contain",
                display: "block",
                ...style,
            }}
        />
    );
}

function Header() {
    const [headerData, setHeaderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const timeoutRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileExpandedIndex, setMobileExpandedIndex] = useState(null);

    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 900);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 900);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (!isMobile) setMenuOpen(false);
    }, [isMobile]);

    useEffect(() => {
        fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa("admin:admin"),
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({
                query: `{
                    headerModelList {
                        items {
                            logo { ... on ImageRef { _path } }
                            navLinks {
                                ... on NavitemModelModel {
                                    title path
                                    title2 path2
                                    title3 path3
                                    title4 path4
                                    title5 path5
                                    sublinks {
                                        ... on NavitemModelModel { title path }
                                    }
                                }
                            }
                        }
                    }
                }`,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setHeaderData(data?.data?.headerModelList?.items?.[0] || null);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: 10 }}>Loading header...</div>;
    if (!headerData) return <div>Error loading header</div>;

    const { logo, navLinks } = headerData;

    const navArray = [];
    const rawLinks = Array.isArray(navLinks) ? navLinks : [navLinks];

    rawLinks.forEach((raw) => {
        Object.keys(raw)
            .filter((k) => k.startsWith("title"))
            .forEach((titleKey) => {
                const suffix = titleKey.replace("title", "");
                const pathKey = suffix ? `path${suffix}` : "path";
                if (raw[titleKey] && raw[pathKey]) {
                    navArray.push({
                        title: raw[titleKey],
                        path: raw[pathKey],
                        sublinks: suffix === "" ? raw.sublinks || [] : [],
                    });
                }
            });
    });

    const leftNav = navArray.slice(0, 3);
    const rightNav = navArray.slice(3);

    const linkStyle = {
        textDecoration: "none",
        color: "white",
        fontWeight: "500",
        whiteSpace: "nowrap",
    };

    return (
        <header style={{ fontFamily: "Arial", position: "relative" }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 24px",
                backgroundColor: "rgb(110 154 177)",
                boxSizing: "border-box",
                width: "100%",
            }}>

                <div style={{ display: "flex", alignItems: "center", gap: 20, minWidth: 0 }}>

                    <div style={{ flexShrink: 0 }}>
                        <AEMImage
                            src={`${AEM_HOST}${logo._path}`}
                            alt="logo"
                            style={{ height: "clamp(30px, 4vw, 50px)" }}
                        />
                    </div>

                    {!isMobile && leftNav.map((nav, index) => {
                        const subArray = Array.isArray(nav.sublinks)
                            ? nav.sublinks
                            : nav.sublinks ? [nav.sublinks] : [];

                        return (
                            <div
                                key={index}
                                style={{ position: "relative", flexShrink: 0 }}
                                onMouseEnter={() => {
                                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                    setHoveredIndex(index);
                                }}
                                onMouseLeave={() => {
                                    timeoutRef.current = setTimeout(() => setHoveredIndex(null), 200);
                                }}
                            >
                                <Link
                                    to={nav.path}
                                    style={{
                                        textDecoration: "none",
                                        color: "white",
                                        fontWeight: "500",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 4,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {nav.title}
                                </Link>

                                {hoveredIndex === index && subArray.length > 0 && (
                                    <div
                                        onMouseEnter={() => {
                                            if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                        }}
                                        onMouseLeave={() => {
                                            timeoutRef.current = setTimeout(() => setHoveredIndex(null), 200);
                                        }}
                                        style={{
                                            position: "absolute",
                                            top: "35px",
                                            left: 0,
                                            background: "rgb(110 154 177)",
                                            borderRadius: 6,
                                            padding: "2px",
                                            minWidth: 60,
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                            zIndex: 10,
                                        }}
                                    >
                                        {subArray.map((sub, i) => (
                                            <Link
                                                key={i}
                                                to={`${nav.path}/${sub.path}`}
                                                style={{
                                                    display: "block",
                                                    padding: "8px 12px",
                                                    textDecoration: "none",
                                                    color: "white",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                {sub.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 15, flexShrink: 0 }}>

                    {!isMobile && rightNav.map((nav, index) => (
                        <Link key={index} to={nav.path} style={linkStyle}>
                            {nav.title}
                        </Link>
                    ))}

                    {!isMobile && (
                        <div style={{ position: "relative" }}>
                            <FiSearch size={18} style={{
                                position: "absolute",
                                top: "50%",
                                left: 10,
                                transform: "translateY(-50%)",
                                color: "#555"
                            }} />
                            <input
                                placeholder="Search..."
                                style={{
                                    padding: "6px 10px 6px 32px",
                                    border: "1px solid #ccc",
                                    borderRadius: 4,
                                    width: "140px",
                                }}
                            />
                        </div>
                    )}

                    <UserProfile />

                    {isMobile && (
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: 0 }}
                        >
                            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    )}
                </div>
            </div>

            {isMobile && menuOpen && (
                <div style={{
                    backgroundColor: "#2e5060",
                    color: "white",
                    position: "absolute",
                    width: "100%",
                    zIndex: 100,
                    boxSizing: "border-box",
                }}>
                    <div style={{ padding: "12px 20px", borderBottom: "1px solid #3d6070" }}>
                        <div style={{ position: "relative" }}>
                            <FiSearch size={16} style={{
                                position: "absolute",
                                top: "50%",
                                left: 10,
                                transform: "translateY(-50%)",
                                color: "#aaa"
                            }} />
                            <input
                                placeholder="Search..."
                                style={{
                                    padding: "8px 10px 8px 32px",
                                    border: "1px solid #4a7a8a",
                                    borderRadius: 4,
                                    width: "100%",
                                    background: "#3d6070",
                                    color: "white",
                                    boxSizing: "border-box",
                                }}
                            />
                        </div>
                    </div>

                    {navArray.map((nav, index) => {
                        const isExpanded = mobileExpandedIndex === index;
                        const subArray = nav.sublinks || [];

                        return (
                            <div key={index} style={{ borderBottom: "1px solid #3d6070" }}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "12px 20px",
                                        cursor: subArray.length > 0 ? "pointer" : "default",
                                    }}
                                    onClick={() =>
                                        subArray.length > 0 &&
                                        setMobileExpandedIndex(isExpanded ? null : index)
                                    }
                                >
                                    <Link
                                        to={nav.path}
                                        style={{ color: "white", textDecoration: "none" }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {nav.title}
                                    </Link>

                                    {subArray.length > 0 && (
                                        <FiChevronDown
                                            style={{
                                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                                transition: "transform 0.2s",
                                                color: "white",
                                            }}
                                        />
                                    )}
                                </div>

                                {isExpanded && subArray.length > 0 && (
                                    <div style={{ background: "#243f4d" }}>
                                        {subArray.map((sub, i) => (
                                            <Link
                                                key={i}
                                                to={`${nav.path}/${sub.path}`}
                                                style={{
                                                    display: "block",
                                                    padding: "10px 30px",
                                                    color: "#cce0ea",
                                                    textDecoration: "none",
                                                }}
                                                onClick={() => setMenuOpen(false)}
                                            >
                                                {sub.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </header>
    );
}

export default Header;