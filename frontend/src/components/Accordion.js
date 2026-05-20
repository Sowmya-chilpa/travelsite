import { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const styles = `
  .accordion-wrapper {
    max-width: 1500px;
    margin: 50px auto;
    font-family: Arial, sans-serif;
    padding: 0 16px;
    box-sizing: border-box;
  }

  .accordion-title {
    text-align: center;
    font-weight: bold;
    margin-bottom: 24px;
    font-size: 22px;
  }

  .accordion-item {
    border-bottom: 1px solid #ccc;
  }

  .accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 8px;
    cursor: pointer;
    font-weight: bold;
    font-size: 15px;
  }

  .accordion-icon {
    font-size: 12px;
    flex-shrink: 0;
    margin-left: 12px;
  }

  .accordion-body {
    display: grid;
    transition: grid-template-rows 0.35s ease;
  }

  .accordion-body-inner {
    overflow: hidden;
  }

  .accordion-text {
    margin: 0;
    padding: 4px 8px 18px;
    font-size: 14px;
    line-height: 1.6;
    color: black;
    text-align: justify;
  }

  @media (max-width: 1024px) {
    .accordion-wrapper {
      max-width: 900px;
      margin: 40px auto;
      padding: 0 24px;
    }

    .accordion-title {
      font-size: 20px;
      margin-bottom: 20px;
    }

    .accordion-header {
      font-size: 14px;
      padding: 16px 8px;
    }
  }

  @media (max-width: 768px) {
    .accordion-wrapper {
      margin: 30px auto;
      padding: 0 16px;
    }

    .accordion-title {
      font-size: 18px;
      margin-bottom: 18px;
    }

    .accordion-header {
      font-size: 14px;
      padding: 14px 6px;
    }

    .accordion-text {
      font-size: 13px;
      padding: 4px 6px 14px;
    }

    .accordion-icon {
      font-size: 11px;
    }
  }

  @media (max-width: 480px) {
    .accordion-wrapper {
      margin: 20px auto;
      padding: 0 12px;
    }

    .accordion-title {
      font-size: 16px;
      margin-bottom: 14px;
    }

    .accordion-header {
      font-size: 13px;
      padding: 12px 4px;
    }

    .accordion-text {
      font-size: 13px;
      padding: 4px 4px 12px;
      text-align: left;
    }

    .accordion-icon {
      font-size: 10px;
    }
  }
`;

const Accordion = () => {
  const [data, setData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const API_URL =
    "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev/content/cq:graphql/TDTraining/endpoint.json";

  useEffect(() => {
    const fetchData = async () => {
      const query = `
      {
        termsandconditionsList {
          items {
            title
            description { plaintext }
          }
        }
      }`;

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("admin:admin"),
        },
        body: JSON.stringify({ query }),
      });

      const result = await res.json();
      if (result.data) {
        setData(result.data.termsandconditionsList.items);
      }
    };

    fetchData();
  }, []);

  const toggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="accordion-wrapper">
        <h2 className="accordion-title">Terms & Conditions</h2>

        {data.map((item, index) => {
          const isOpen = activeIndex === index;
          return (
            <div key={index} className="accordion-item">
              <div
                className="accordion-header"
                onClick={() => toggle(index)}
              >
                <span>{item.title}</span>
                <span className="accordion-icon">
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              <div
                className="accordion-body"
                style={{
                  gridTemplateRows: isOpen ? "1fr" : "0fr",
                }}
              >
                <div className="accordion-body-inner">
                  <p className="accordion-text">
                    {item.description.plaintext}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default Accordion;