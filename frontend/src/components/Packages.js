import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./Packages.css";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";

const PackageCard = ({ item }) => {
  const [imgSrc, setImgSrc] = useState("https://placehold.co/400x220");

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

  return (
    <div className="package-container-card">
      <div className="package-container-card-img">
        <img src={imgSrc} alt={item.packagetitle} />
        <span className="package-container-badge">{item.duration}</span>
      </div>
      <div className="package-container-card-body">
        <h3>{item.packagetitle}</h3>
        <p className="package-container-desc">{item.shortdescription?.plaintext}</p>
        <div className="package-container-card-footer">
          <span className="package-container-price">₹{item.priceperperson}</span>
          <button>Explore</button>
        </div>
      </div>
    </div>
  );
};

const Packages = () => {
   const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const typeFromUrl = queryParams.get("type");

  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(typeFromUrl || "all");

  useEffect(() => {
    if (typeFromUrl) {
      setFilter(typeFromUrl);
    }
  }, [typeFromUrl]);
  
  useEffect(() => {
    fetch(`${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa("admin:admin"),
        "ngrok-skip-browser-warning": "true",
      },
      body: JSON.stringify({
        query: `
        {
          travelpackagemodelList {
            items {
              packagetitle
              category
              duration
              priceperperson
              shortdescription { plaintext }
              coverimage { ... on ImageRef { _path } }
            }
          }
        }
        `,
      }),
    })
      .then((res) => res.json())
      .then((resData) => {
        setData(resData.data.travelpackagemodelList.items);
      });
  }, []);

  const filteredData =
    filter === "all"
      ? data
      : data.filter(
          (item) => item.category?.trim().toLowerCase() === filter
        );

  return (
    <div className="package-container">
      <h2 className="package-container-title">Discover Your Next Journey</h2>
      <p className="package-container-subtitle">Handpicked experiences for every traveler</p>

      <div className="package-container-filters">
        {["all", "domestic", "international", "adventure"].map((cat) => (
          <button
            key={cat}
            className={filter === cat ? "active" : ""}
            onClick={() => setFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="package-container-grid">
        {filteredData.map((item, index) => (
          <PackageCard key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Packages;