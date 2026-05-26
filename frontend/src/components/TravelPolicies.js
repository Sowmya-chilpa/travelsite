import { useEffect, useState } from "react";
import AEMImage from "../components/AEMImage";
import "./TravelPolicies.css";

const AEM_HOST = process.env.REACT_APP_AEM_HOST;
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

function TravelPolicies() {

  const [policyData, setPolicyData] = useState(null);
    useEffect(() => {
      fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
      const query = {
        query: `
          {
            travelpoliciesmodelList {
              items {
                heroTitle
                heroDescription {
                  plaintext
                }
                heroImage {
                  ... on ImageRef {
                    _path
                  }
                }
                introTitle
                introDescription {
                  plaintext
                }
                bookingPolicy {
                  plaintext
                }
                cancellationPolicy {
                  plaintext
                }
                refundPolicy {
                  plaintext
                }
                safetyGuidelines {
                  plaintext
                }
                termsConditions {
                  plaintext
                }
              }
            }
          }
        `
      };

      try {
        const response = await fetch(ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Basic " + btoa("admin:admin"),
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify(query),
        });
        const result = await response.json();
        console.log(result);
        const item = result?.data?.travelpoliciesmodelList?.items?.[0];
        if (item) {
          setPolicyData(item);
        }

      } catch (error) {
        console.error("Error fetching policies:", error);
      }
    };

  if (!policyData) {
    return (
      <div className="travel-policies-page">
        <div className="policies-loading">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="travel-policies-page">

      <div className="policies-hero">
        <AEMImage
          src={`${AEM_HOST}${policyData.heroImage?._path}`}
          alt={policyData.heroTitle}
          className="policies-hero-image"
        />
        <div className="policies-overlay">
          <h1>{policyData.heroTitle}</h1>
          <p>
            {policyData.heroDescription?.plaintext}
          </p>
        </div>

      </div>

      <section className="policies-intro">
        <h2>{policyData.introTitle}</h2>
        <p>
          {policyData.introDescription?.plaintext}
        </p>
      </section>

      <section className="policies-container">
        <div className="policy-card">
          <h3>Booking Policy</h3>
          <p>
            {policyData.bookingPolicy?.plaintext}
          </p>
        </div>

        <div className="policy-card">
          <h3>Cancellation Policy</h3>
          <p>
            {policyData.cancellationPolicy?.plaintext}
          </p>
        </div>

        <div className="policy-card">
          <h3>Refund Policy</h3>
          <p>
            {policyData.refundPolicy?.plaintext}
          </p>
        </div>

        <div className="policy-card">
          <h3>Safety Guidelines</h3>
          <p>
            {policyData.safetyGuidelines?.plaintext}
          </p>
        </div>

        <div className="policy-card">
          <h3>Terms & Conditions</h3>
          <p>
            {policyData.termsConditions?.plaintext}
          </p>
        </div>

      </section>

    </div>
  );
}

export default TravelPolicies;