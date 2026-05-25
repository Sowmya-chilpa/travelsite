import { useEffect, useState } from "react";
import AEMImage from "../components/AEMImage";
import "./Contact.css";

const AEM_HOST = process.env.REACT_APP_AEM_HOST;
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

const Contact = () => {
  const [contactData, setContactData] = useState(null);
  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    const query = {
      query: `
        {
          contactpagemodelList {
            items {
              heroTitle
              heroImage {
                ... on ImageRef {
                  _path
                }
              }
              contactDescription {
                plaintext
              }
              phoneNumber
              emailAddress
              officeAddress {
                plaintext
              }
              officeTimings
            }
          }
        }
      `,
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
      setContactData(
        result.data.contactpagemodelList.items[0]
      );

    } catch (error) {
      console.error("Error fetching contact page:", error);
    }
  };

  if (!contactData) {
    return (
      <div className="contact-page">
        <div className="contact-loading">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <AEMImage
          src={`${AEM_HOST}${contactData.heroImage?._path}`}
          alt={contactData.heroTitle}
          className="contact-hero-image"
        />

        <div className="contact-hero-overlay">
          <h1>{contactData.heroTitle}</h1>
        </div>
      </div>

      <section className="contact-info-section">

        <p className="contact-description">
          {contactData.contactDescription?.plaintext}
        </p>
        <div className="contact-cards">
          <div className="contact-card">
            <h3>Phone</h3>
            <p>{contactData.phoneNumber}</p>
          </div>

          <div className="contact-card">
            <h3>Email</h3>
            <p>{contactData.emailAddress}</p>
          </div>

          <div className="contact-card">
            <h3>Address</h3>
            <p>{contactData.officeAddress?.plaintext}</p>
          </div>

          <div className="contact-card">
            <h3>Office Timings</h3>
            <p>{contactData.officeTimings}</p>
          </div>
        </div>

      </section>

      <section className="contact-form-section">

        <h2>Send Us a Message</h2>
        <form className="contact-form">
          <input
            type="text"
            placeholder="Your Name"
          />
          <input
            type="email"
            placeholder="Your Email"
          />
          <textarea
            placeholder="Your Message"
            rows="6"
          />
          <button type="submit">
            Send Message
          </button>
        </form>

      </section>

    </div>
  );
};

export default Contact;