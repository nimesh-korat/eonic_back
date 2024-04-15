const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function DeleteBanner(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('banner');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { bannerId } = req.body;

        if (!ObjectId.isValid(bannerId)) {
            return res.status(400).json({ success: false, message: "Invalid Banner ID!" });
        }

        const deletedBanner = await collection.deleteOne({ _id: ObjectId.createFromHexString(bannerId) });

        if (deletedBanner.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "Banner not found!" });
        }

        return res.status(200).json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        console.error("deleteBanner.js ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { DeleteBanner };
