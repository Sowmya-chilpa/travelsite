const searchService = require("../services/searchService");

const searchContent = async (req, res) => {

    try {

        const { query } = req.query;
        if (!query || query.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const results = await searchService.searchContent(query);
        res.status(200).json({
            success: true,
            data: results
        });

    } 
    catch (error) {

        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

};

module.exports = {
    searchContent
};