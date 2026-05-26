import { useEffect, useState } from "react";
import StoryCard from "../components/StoryCard";
import "./TravelStories.css";

const AEM_HOST = process.env.REACT_APP_AEM_HOST;

const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

function TravelStories() {

  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {

    const query = {
      query: `
        {
          experiencestorymodelList {

            items {

              storyTitle

              storyDescription {
                plaintext
              }

              storyImage {
                ... on ImageRef {
                  _path
                }
              }

              authorName

              travelLocation

              publishDate
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


      const items =
        result?.data?.experiencestorymodelList?.items || [];

      setStories(items);

    } catch (error) {

      console.error("Error fetching stories:", error);

    }
  };

  return (

    <div className="travelStoriesPage">

      <h1 className="travelStoriesHeading">
        Travel Stories
      </h1>

      <div className="storiesGrid">

        {stories.map((story, index) => (

          <StoryCard
            key={index}
            data={story}
          />

        ))}

      </div>

    </div>

  );
}

export default TravelStories;