const AEM_HOST = process.env.AEM_HOST;
const ENDPOINT = `${AEM_HOST}/content/cq:graphql/TDTraining/endpoint.json`;

const searchContent = async (searchTerm) => {

    const query = {
        query: `
        {
            destinationList {
                items {
                    destinationName
                    slug
                    tagLine
                    heroImage {
                        ... on ImageRef {
                            _path
                        }
                    }
                    isfeatured
                }
            }
            travelpackagemodelList {
                items {
                    packagetitle
                    category
                    duration
                    priceperperson
                    shortdescription {
                        plaintext
                    }
                    coverimage {
                        ... on ImageRef {
                            _path
                        }
                    }
                }
            }
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

        const response =
        await fetch(
            ENDPOINT,
            {
                method:"POST",
                headers:{
                    "Content-Type":
                    "application/json",
                     Authorization: "Basic " + Buffer.from("admin:admin").toString("base64"),
                    "ngrok-skip-browser-warning" : "true"
                },
                body : JSON.stringify(query)
            }
        );

        const result = await response.json();
        const destinations  = result ?.data ?.destinationList ?.items || [];
        const packages = result?.data?.travelpackagemodelList?.items || [];
        const stories = result?.data?.experiencestorymodelList?.items || [];

        const filteredDestinations  = destinations.filter((item) => {
            return item.destinationName ?.toLowerCase().includes( searchTerm.toLowerCase() );
        })
        .map((item) => ({
            title : item.destinationName,
            slug : item.slug,
            description : item.tagLine,
            image : item.heroImage?._path,
            type : "destination"
        }));

        const search = searchTerm.toLowerCase();

        const filteredPackages = packages.filter((item)=>{
            return (
                item.packagetitle ?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category?.toLowerCase().includes(search));
        })
        .map((item)=>({
            title : item.packagetitle,
            description : item.shortdescription ?.plaintext,
            image : item.coverimage?._path,
            duration : item.duration,
            category : item.category,
            price : item.priceperperson,
            type : "package"
        }));

        const filteredStories = stories
        .filter((item) => {
            const search = searchTerm.toLowerCase();
            return (
                item.storyTitle?.toLowerCase().includes(search) ||
                item.travelLocation?.toLowerCase().includes(search) ||
                item.authorName?.toLowerCase().includes(search)
            );
        })
        .map((item) => ({
            title: item.storyTitle,
            description: item.storyDescription?.plaintext,
            image: item.storyImage?._path,
            location: item.travelLocation,
            author: item.authorName,
            type: "story"
        }))

        return [
            ...filteredDestinations,
            ...filteredPackages,
            ...filteredStories
        ];

    }
    catch(error){
        console.error("Search service error:", error);
        throw error;
    }

};

module.exports = { searchContent };