import AEMImage from "./AEMImage";

const AEM_HOST = "https://katrina-nonmonogamous-pseudofamously.ngrok-free.dev";

function StoryCard({ data }) {

  const imagePath = data.storyImage?._path;

  return (

    <div className="storyCard">

      <div className="storyImageWrapper">

        {imagePath ? (

          <AEMImage
            src={`${AEM_HOST}${imagePath}`}
            alt={data.storyTitle}
            className="storyImage"
          />

        ) : (

          <div className="storyPlaceholder" />

        )}

      </div>

      <div className="storyContent">

        <h2 className="storyTitle">
          {data.storyTitle}
        </h2>

        <p className="storyLocation">
          {data.travelLocation}
        </p>

        <p className="storyDescription">

          {data.storyDescription?.plaintext?.slice(0, 140)}...

        </p>

        <p className="storyAuthor">

          By {data.authorName}

        </p>

      </div>

    </div>

  );
}

export default StoryCard;