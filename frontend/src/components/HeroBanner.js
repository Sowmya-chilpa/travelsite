import { useEffect, useState } from "react";
import AEMImage from "./AEMImage"

const AEM_HOST = process.env.REACT_APP_AEM_HOST;
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;


const css = `
.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.banner {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 10px;
}

.textSection, .imageSection {
  flex: 1;
  padding: 10px 0px;
}

.title {
  font-size: 32px;
  margin-bottom: 16px;
  font-weight: 600;
}

.description {
  font-size: 16px;
  color: #555;
  line-height: 1.6;
}

.image {
  width: 100%;
  height: 320px;
  object-fit: cover;
}

.placeholder {
  height: 320px;
  background: #eee;
}

@media (max-width: 768px) {
  .banner {
    flex-direction: column !important;
    gap: 10px;
  }

  .textSection, .imageSection {
    padding: 10px;
  }

  .title {
    font-size: 24px;
  }

  .image {
    height: 220px;
  }
}
`;

function HeroBanner() {
  const [banners, setBanners] = useState([]);

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
          herobannermodelList {
            items {
              title
              layout
              description {
                plaintext
              }
              image {
                ... on ImageRef {
                  _path
                }
              }
            }
          }
        }`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setBanners(data?.data?.herobannermodelList?.items || []);
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <style>{css}</style>

      <div className="container">
        {banners.map((item, index) => {
          const isLeft = item.layout === "left";

          return (
            <div
              key={index}
              className="banner"
              style={{
                flexDirection: isLeft ? "row" : "row-reverse",
              }}
            >
              <div className="textSection">
                <h2 className="title">{item.title}</h2>
                <p className="description">
                  {item.description?.plaintext}
                </p>
              </div>

              <div className="imageSection">
                {item.image?._path && (
                  <AEMImage
                    src={`${AEM_HOST}${item.image._path}`}
                    alt={item.title}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default HeroBanner;