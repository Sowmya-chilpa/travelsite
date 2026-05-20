import { useState, useEffect, useRef } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { FiPauseCircle } from "react-icons/fi";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

function AEMImage({ src, alt }) {
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
        <>
            <style>{`
                @keyframes spin {
                    0%   { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
            <div style={{
                width: "100%",
                height: "50vw",
                maxHeight: "500px",
                borderRadius: "15px",
                background: "#f0f0f0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}>
                <div style={{
                    width: "48px",
                    height: "48px",
                    border: "5px solid #ddd",
                    borderTop: "5px solid rgb(110, 154, 177)",
                    borderRadius: "50%",
                    animation: "spin 0.9s linear infinite",
                }} />
            </div>
        </>
    );

    return (
        <img
            src={objectUrl}
            alt={alt}
            style={{
                width: "100%",
                height: "50vw",
                maxHeight: "500px",
                objectFit: "cover",
                borderRadius: "15px",
            }}
        />
    );
}

function AEMCarousel() {
    const [slides, setSlides] = useState([]);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [autoPlay, setAutoPlay] = useState(true);
    const [visibleSlides, setVisibleSlides] = useState(new Set());
    const carouselRef = useRef(null);

    useEffect(() => {
        if (slides.length === 0) return;
        setVisibleSlides((prev) => {
            const updated = new Set(prev);
            updated.add(current);
            return updated;
        });
    }, [current, slides.length]);

    useEffect(() => {
        if (slides.length === 0) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisibleSlides((prev) => {
                        const updated = new Set(prev);
                        updated.add(current);
                        return updated;
                    });
                }
            },
            { threshold: 0.1 }
        );

        if (carouselRef.current) observer.observe(carouselRef.current);
        return () => observer.disconnect();
    }, [slides.length, current]);

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
                    carouselModelList {
                        items {
                            title
                            image { ... on ImageRef { _path } }
                            description { plaintext }
                        }
                    }
                }`,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setSlides(data.data.carouselModelList.items);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
    if (error) return <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>;

    const renderArrowPrev = (clickHandler) => (
        <button
            onClick={clickHandler}
            disabled={current === 0}
            style={{
                position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
                zIndex: 10, background: "white", border: "none", borderRadius: "50%",
                width: 40, height: 40, fontSize: 18,
                cursor: current === 0 ? "not-allowed" : "pointer",
                opacity: current === 0 ? 0.3 : 1,
            }}
        >
            ‹
        </button>
    );

    const renderArrowNext = (clickHandler) => (
        <button
            onClick={clickHandler}
            disabled={current === slides.length - 1}
            style={{
                position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
                zIndex: 10, background: "white", border: "none", borderRadius: "50%",
                width: 40, height: 40, fontSize: 18,
                cursor: current === slides.length - 1 ? "not-allowed" : "pointer",
                opacity: current === slides.length - 1 ? 0.3 : 1,
            }}
        >
            ›
        </button>
    );

    return (
        <div ref={carouselRef} style={{ maxWidth: "100%", padding: "18px" }}>
            <Carousel
                infiniteLoop={true}
                autoPlay={autoPlay}
                showThumbs={false}
                showStatus={false}
                swipeable={true}
                showIndicators={false}
                emulateTouch={true}
                selectedItem={current}
                onChange={(index) => setCurrent(index)}
                renderArrowPrev={renderArrowPrev}
                renderArrowNext={renderArrowNext}
            >
                {slides.map((slide, index) => (
                    <div key={index} style={{ position: "relative" }}>

                        {visibleSlides.has(index) ? (
                            <AEMImage
                                src={`${AEM_HOST}${slide.image._path}`}
                                alt={slide.title}
                            />
                        ) : (
                            <div style={{
                                width: "100%",
                                height: "50vw",
                                maxHeight: "500px",
                                borderRadius: "15px",
                                background: "#f0f0f0",
                            }} />
                        )}
                    </div>
                ))}
            </Carousel>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                <div style={{
                    display: "flex", justifyContent: "center",
                    gap: "8px", marginTop: "18px", marginRight: "10px",
                }}>
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrent(index)}
                            style={{
                                width: index === current ? "10px" : "8px",
                                height: index === current ? "10px" : "8px",
                                borderRadius: "50%",
                                background: index === current ? "white" : "#bbb",
                                border: index === current
                                    ? "2px solid rgb(110, 154, 177)"
                                    : "2px solid #bbb",
                                cursor: "pointer",
                                padding: 0,
                                transition: "all 0.3s ease",
                            }}
                        />
                    ))}
                </div>

                <div style={{ textAlign: "center", marginTop: "10px" }}>
                    <button
                        onClick={() => setAutoPlay((prev) => !prev)}
                        style={{
                            color: "black", fontSize: "25px",
                            background: "none", border: "none", cursor: "pointer",
                            padding: 0, display: "inline-flex",
                            alignItems: "center", justifyContent: "center",
                        }}
                    >
                        {autoPlay
                            ? <><FiPauseCircle /><span style={{ fontSize: "15px", marginLeft: "4px" }}>Pause</span></>
                            : <><FaCirclePlay /><span style={{ fontSize: "15px", marginLeft: "4px" }}>Play</span></>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AEMCarousel;