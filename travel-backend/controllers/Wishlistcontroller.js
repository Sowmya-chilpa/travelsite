const {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
} = require("../services/wishlistService");

const addItem = async (req, res) => {
    try {
        const item = await addToWishlist(req.user.id, req.body);
        res.status(201).json({ message: "Added to wishlist", item });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const removeItem = async (req, res) => {
    try {
        const { packagetitle } = req.params;
        await removeFromWishlist(req.user.id, decodeURIComponent(packagetitle));
        res.status(200).json({ message: "Removed from wishlist" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getItems = async (req, res) => {
    try {
        const items = await getWishlist(req.user.id);
        res.status(200).json({ items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addItem, removeItem, getItems };