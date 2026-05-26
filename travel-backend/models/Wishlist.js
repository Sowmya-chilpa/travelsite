const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        packagetitle: {
            type: String,
            required: true,
        },
        category: {
            type: String,
        },
        duration: {
            type: String,
        },
        priceperperson: {
            type: Number,
        },
        shortdescription: {
            type: String,
        },
        coverImagePath: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate wishlist entries per user
wishlistSchema.index({ user: 1, packagetitle: 1 }, { unique: true });

module.exports = mongoose.model("Wishlist", wishlistSchema);