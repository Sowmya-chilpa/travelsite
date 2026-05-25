import { useEffect, useState } from "react";
import "./Banner.css";
import TripPlan from "./TripPlan";
import { FiX } from "react-icons/fi";

const AEM_HOST = process.env.REACT_APP_AEM_HOST;
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
        return <div style={{ height: "100%", background: "#eee" }} />;
    }

    return <img src={objectUrl} alt={alt} style={style} />;
}

function Banner() {
    const [banner, setBanner] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch(ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Basic " + btoa("admin:admin"),
                "ngrok-skip-browser-warning": "true",
            },
            body: JSON.stringify({
                query: `
                    query {
                        bannermodelList {
                            items {
                                title
                                description {
                                    plaintext
                                }
                                buttonText
                                buttonLink
                                bannerimage {
                                    ... on ImageRef {
                                        _path
                                    }
                                }
                            }
                        }
                    }
                `,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setBanner(data?.data?.bannermodelList?.items?.[0] || null);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div style={{ padding: 20 }}>Loading banner...</div>;
    if (!banner) return <div>Error loading banner</div>;

    const imageUrl = `${AEM_HOST}${banner.bannerimage?._path}`;

    return (
        <>
            <div className="banner-wrapper">
                <AEMImage
                    src={imageUrl}
                    alt="banner"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div className="banner-overlay">
                    <div className="banner-content">
                        <h1 className="banner-title">{banner.title}</h1>
                        <p className="banner-description">{banner.description?.plaintext}</p>
                        <button
                            className="banner-btn"
                            onClick={() => setShowModal(true)}
                        >
                            {banner.buttonText}
                        </button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="close-btn"
                            onClick={() => setShowModal(false)}
                        >
                            <FiX />
                        </button>
                        <TripPlan />
                    </div>
                </div>
            )}
        </>
    );
}

export default Banner;