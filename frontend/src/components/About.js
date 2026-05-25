import { useEffect, useState } from "react";
import AEMImage from "../components/AEMImage";
import "./About.css";

const AEM_HOST = process.env.REACT_APP_AEM_HOST;
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    const query = {
      query: `
        {
          aboutpagemodelList {
            items {
              heroTitle             
              heroImage {
                ... on ImageRef {
                  _path
                }
              }
              introTitle
              introDescription {
                plaintext
              }
              missionTitle
              missionDescription {
                plaintext
              }
              travallersCount
              destinationCount
              chooseUsTitle
              chooseUsDescription {
                plaintext
              }
            }
          }
        }
      `,
    };

    try {
      const response = await fetch(
        ENDPOINT,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
            Authorization: "Basic " + btoa("admin:admin"),
          },
          body: JSON.stringify(query),
        }
      );

      const result = await response.json();
      // console.log(result.data.aboutpagemodelList.items[0]);

      //setAboutData(result.data.aboutpagemodelList.items[0]);
      const item = result?.data?.aboutpagemodelList?.items?.[0];
      if (item) {
        setAboutData(item);
      }
    } catch (error) {
      console.error("Error fetching About page data:", error);
    }
  };

  if (!aboutData) {
    return (
      <div className="about-page">
        <div className="about-loading">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="about-page">

      <div className="about-hero">
        <AEMImage
          src={`${AEM_HOST}${aboutData.heroImage?._path}`}
          alt={aboutData.heroTitle}
          className="about-hero-image"
        />

        <div className="about-hero-overlay">
          <h1>{aboutData.heroTitle}</h1>
        </div>

      </div>

      <section className="about-section">
        <h2>{aboutData.introTitle}</h2>
        <p>
          {aboutData.introDescription?.plaintext}
        </p>
      </section>

      <section className="about-section">
        <h2>{aboutData.missionTitle}</h2>
        <p>
          {aboutData.missionDescription?.plaintext}
        </p>
      </section>

      <section className="about-stats">
        <div className="about-stat-card">
          <h2>{aboutData.travallersCount}</h2>
          <p>Happy Travelers</p>
        </div>
        <div className="about-stat-card">
          <h2>{aboutData.destinationCount}</h2>
          <p>Destinations</p>
        </div>
      </section>

      <section className="about-section">
        <h2>{aboutData.chooseUsTitle}</h2>
        <p>
          {aboutData.chooseUsDescription?.plaintext}
        </p>
      </section>

    </div>
  );
};

export default About;