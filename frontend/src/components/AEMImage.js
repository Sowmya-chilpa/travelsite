import { useEffect, useState } from "react";

function AEMImage({ src, alt, className = "image" }) {
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

  if (!objectUrl) return <div className="placeholder" />;

  return <img src={objectUrl} alt={alt} className={className} />;
}

export default AEMImage;