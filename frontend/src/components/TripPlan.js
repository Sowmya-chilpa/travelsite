import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TripPlan.css";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;


const TripPlan = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

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
                    tripPlanModelList {
                        items {
                            packageType
                            title
                            tagline
                            price
                            currency
                            ctalabel
                            ctapath
                            features
                            badge
                        }
                    }
                }`,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setPackages(data?.data?.tripPlanModelList?.items || []);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
    if (error) return <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>;

    return (
        <div className="packages-container">
            {packages.map((pkg, index) => (
                <div key={index} className={`card ${pkg.packageType}`}>

                    {pkg.badge && (
                        <div className="badge">{pkg.badge}</div>
                    )}

                    <div className="card-header">
                        <h3>{pkg.title?.trim()}</h3>
                        <h1>
                            {pkg.currency} {pkg.price?.toLocaleString()}
                            <span className="per"> /trip</span>
                        </h1>
                        <p>{pkg.tagline?.trim()}</p>
                    </div>

                    <div className="card-body">
                        <ul>
                            {pkg.features?.map((feature, i) => (
                                <li key={i}>✔ {feature}</li>
                            ))}
                        </ul>

                        <button
                            className="cta"
                            onClick={() => {
                                const type = pkg.packageType?.toLowerCase().trim();
                                navigate(`/packages?type=${type}`);
                            }}
                        >
                            {pkg.ctalabel}
                        </button>
                    </div>

                </div>
            ))}
        </div>
    );
}

export default TripPlan;