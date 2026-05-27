const Wishlist = require("../models/Wishlist");

const addToWishlist = async (userId, packageData) => {
    const existing = await Wishlist.findOne({
        user: userId,
        packagetitle: packageData.packagetitle,
    });

    if (existing) {
        throw new Error("Package already in wishlist");
    }

    const item = new Wishlist({
        user: userId,
        ...packageData,
    });
    await item.save();
    return item;
};

const removeFromWishlist = async (userId, packagetitle) => {
    const result = await Wishlist.findOneAndDelete({
        user: userId,
        packagetitle,
    });

    if (!result) {
        throw new Error("Item not found in wishlist");
    }

    return result;
};

const getWishlist = async (userId) => {
    return await Wishlist.find({ user: userId }).sort({ createdAt: -1 });
};

module.exports = {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
};
