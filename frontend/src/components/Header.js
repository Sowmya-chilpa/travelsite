import { useState, useEffect, useRef } from "react";
import { FiSearch, FiUser, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { Link } from "react-router-dom";

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

        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [src]);

    if (!objectUrl) {
        return (
            <div style={{ width: 60, height: 40, background: "#eee", borderRadius: 4 }} />
        );
    }

    return <img src={objectUrl} alt={alt} style={style} />;
}

function Header() {
    const [headerData, setHeaderData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const timeoutRef = useRef(null);

    const [menuOpen, setMenuOpen] = useState(false);
    const [mobileExpandedIndex, setMobileExpandedIndex] = useState(null);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
              logo {
                ... on ImageRef {
                  _path
                }
              }
              navLinks {
                ... on NavitemModelModel {
                  title
                  path
                  sublinks {
                    ... on NavitemModelModel {
                      title
                      path
                    }
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

    const navArray = Array.isArray(navLinks)
        ? navLinks
        : navLinks
            ? [navLinks]
            : [];

    return (
        <header style={{ fontFamily: "Arial", position: "relative", }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px 24px",
                    backgroundColor: "rgb(110 154 177)",
                    color: "black",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                    <AEMImage
                        src={`${AEM_HOST}${logo._path}`}
                        alt="logo"
                        style={{ height: 50, objectFit: "contain" }}
                    />

                    {!isMobile &&
                        navArray.map((nav, index) => {
                            const subArray = Array.isArray(nav.sublinks)
                                ? nav.sublinks
                                : nav.sublinks
                                    ? [nav.sublinks]
                                    : [];

                            return (
                                <div
                                    key={index}
                                    style={{ position: "relative" }}
                                    onMouseEnter={() => {
                                        if (timeoutRef.current) clearTimeout(timeoutRef.current);
                                        setHoveredIndex(index);
                                    }}
                                    onMouseLeave={() => {
                                        timeoutRef.current = setTimeout(
                                            () => setHoveredIndex(null),
                                            200
                                        );
                                    }}
                                >
                                    <Link
                                        to={nav.path}
                                        style={{
                                            textDecoration: "none",
                                            color: "white",
                                            marginRight: 20,
                                            fontWeight: "500",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                        }}
                                    >
                                        {nav.title}
                                        {subArray.length > 0 && (
                                            <FiChevronDown
                                                size={14}
                                                style={{
                                                    transition: "transform 0.2s",
                                                    transform:
                                                        hoveredIndex === index
                                                            ? "rotate(180deg)"
                                                            : "rotate(0deg)",
                                                }}
                                            />
                                        )}
                                    </Link>

                                    {hoveredIndex === index && subArray.length > 0 && (
                                        <div
                                            onMouseEnter={() => {
                                                if (timeoutRef.current)
                                                    clearTimeout(timeoutRef.current);
                                            }}
                                            onMouseLeave={() => {
                                                timeoutRef.current = setTimeout(
                                                    () => setHoveredIndex(null),
                                                    200
                                                );
                                            }}
                                            style={{
                                                position: "absolute",
                                                top: "35px",
                                                left: 0,
                                                background: "#fff",
                                                color: "#000",
                                                borderRadius: 6,
                                                padding: "8px 0",
                                                minWidth: 150,
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
                                                        color: "black",
                                                    }}
                                                    onMouseEnter={(e) =>
                                                        (e.target.style.background = "#f5f5f5")
                                                    }
                                                    onMouseLeave={(e) =>
                                                        (e.target.style.background = "white")
                                                    }
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

                <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
                    {!isMobile && (
                        <div style={{ position: "relative" }}>
                            <FiSearch
                                size={18}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: 10,
                                    transform: "translateY(-50%)",
                                    color: "#555",
                                }}
                            />
                            <input
                                placeholder="Search..."
                                style={{
                                    padding: "6px 10px 6px 32px",
                                    border: "1px solid #ccc",
                                    borderRadius: 4,
                                    outline: "none",
                                }}
                            />
                        </div>
                    )}

                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: "50%",
                            background: "#f0f0f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }}
                    >
                        <FiUser size={18} color="#333" />
                    </div>

                    {isMobile && (
                        <button
                            onClick={() => setMenuOpen((prev) => !prev)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                            }}
                            aria-label="Toggle menu"
                        >
                            {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    )}
                </div>
            </div>

            {isMobile && menuOpen && (
                <div
                    style={{
                        backgroundColor: "#2e5060",
                        color: "white",
                        padding: "8px 0",
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 100,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                >
                    <div style={{ padding: "8px 20px" }}>
                        <div style={{ position: "relative" }}>
                            <FiSearch
                                size={16}
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: 10,
                                    transform: "translateY(-50%)",
                                    color: "#aaa",
                                }}
                            />
                            <input
                                placeholder="Search..."
                                style={{
                                    width: "100%",
                                    boxSizing: "border-box",
                                    padding: "8px 10px 8px 34px",
                                    border: "1px solid #ccc",
                                    borderRadius: 4,
                                    outline: "none",
                                    background: "#fff",
                                }}
                            />
                        </div>
                    </div>

                    {navArray.map((nav, index) => {
                        const subArray = Array.isArray(nav.sublinks)
                            ? nav.sublinks
                            : nav.sublinks
                                ? [nav.sublinks]
                                : [];

                        const isExpanded = mobileExpandedIndex === index;

                        return (
                            <div key={index}>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "12px 20px",
                                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                                        cursor: subArray.length > 0 ? "pointer" : "default",
                                    }}
                                    onClick={() => {
                                        if (subArray.length > 0) {
                                            setMobileExpandedIndex(
                                                isExpanded ? null : index
                                            );
                                        }
                                    }}
                                >
                                    <Link
                                        to={nav.path}
                                        style={{
                                            textDecoration: "none",
                                            color: "white",
                                            fontWeight: "500",
                                            fontSize: 15,
                                        }}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {nav.title}
                                    </Link>

                                    {subArray.length > 0 && (
                                        <FiChevronDown
                                            size={16}
                                            color="white"
                                            style={{
                                                transition: "transform 0.2s",
                                                transform: isExpanded
                                                    ? "rotate(180deg)"
                                                    : "rotate(0deg)",
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
                                                    padding: "10px 32px",
                                                    textDecoration: "none",
                                                    color: "#cce0ea",
                                                    fontSize: 14,
                                                    borderBottom:
                                                        "1px solid rgba(255,255,255,0.05)",
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

