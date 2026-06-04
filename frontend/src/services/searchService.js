const API_URL = process.env.REACT_APP_API_URL;

const searchContent = async( query ) => {
    try{

        const response = await fetch(`${API_URL}/search?query=${query}`);
        const data = await response.json();
        return data;

    }
    catch(error) {
         console.error( "Search API Error:",error );

         return {
            success: false,
            data: []
        };
    }
}

export default searchContent ;