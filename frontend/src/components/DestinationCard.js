import AEMImage from "./AEMImage";

const AEM_HOST =
  "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";

function DestinationCard({ data, isCarousel }) {
  const imagePath = data.heroImage?._path;

  return (
    <div
      className={
        isCarousel
          ? "destinationCard"
          : "destinationGridCard"
      }
    >
      <div className="destinationImageWrapper">
        {imagePath ? (
          <AEMImage
            src={`${AEM_HOST}${imagePath}`}
            alt={data.destinationName}
          />
        ) : (
          <div className="placeholder" />
        )}
      </div>

      {isCarousel ? (
        <div className="destinationOverlay">
          <div className="destinationTitle">
            {data.destinationName}
          </div>

          <div className="destinationTagline">
            {data.tagLine}
          </div>
        </div>
      ) : (
        <div className="destinationContent">
          <div className="destinationTitleDark">
            {data.destinationName}
          </div>

          <div className="destinationTaglineDark">
            {data.tagLine}
          </div>
        </div>
      )}
    </div>
  );
}

export default DestinationCard;