import { FaLinkedin, FaFacebook, FaGithub, FaTwitter, FaInstagram } from "react-icons/fa";
import { useEffect, useState } from "react";
import "./Footer.css";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

const Footer = () => {
  const [data, setData] = useState(null);
  const [bgImage, setBgImage] = useState("");

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
          footermodelList {
            items {
              logotext
              tagline
              links {
                plaintext
              }
              linkcookies
              contacttext
              copyright
              backgroundimage {
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
      .then((resData) => {
        console.log("API RESPONSE:", resData);

        if (resData.data && resData.data.footermodelList) {
          setData(resData.data.footermodelList.items[0]);
        }
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!data?.backgroundimage?._path) return;

    const imagePath = `${AEM_HOST}${data.backgroundimage._path}`;

    fetch(imagePath, {
      headers: {
        "ngrok-skip-browser-warning": "true",
        Authorization: "Basic " + btoa("admin:admin"),
      },
    })
      .then((res) => res.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        setBgImage(objectUrl);
      })
      .catch(console.error);
  }, [data]);

  if (!data) return <p>Loading footer...</p>;

  const linksArray = data.links.plaintext.split("\n").filter(Boolean);

  return (
    <footer
      className="footer"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="overlay"></div>

      <div className="footer-content">
        <h1 className="logo">{data.logotext}</h1>
        <p className="tagline">{data.tagline}</p>

        <div className="links">
          {linksArray.map((link, index) => (
            <a
              key={index}
              href={link === "Packages" ? "/packages" : "/"}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="social-icons">
          <FaLinkedin />
          <FaFacebook />
          <FaGithub />
          <FaTwitter />
          <FaInstagram />
        </div>

        <p className="contact">{data.contacttext}</p>
        <p className="cookies">{data.linkcookies}</p>
        <p className="copyright">{data.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;