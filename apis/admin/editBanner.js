const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function EditBanner(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('banner');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { bannerId, bannerTitle, bannerDesc } = req.body;
        const bannerImg = req.file ? req.file.filename : undefined;

        if (!ObjectId.isValid(bannerId)) {
            return res.status(400).json({ success: false, message: "Invalid Banner ID!" });
        }

        const existingBanner = await collection.findOne({ _id: ObjectId.createFromHexString(bannerId) });

        if (!existingBanner) {
            return res.status(404).json({ success: false, message: "Banner not found!" });
        }

        const updatedBanner = {
            bannerTitle: bannerTitle || existingBanner.bannerTitle,
            bannerDesc: bannerDesc || existingBanner.bannerDesc,
            bannerImg: bannerImg || existingBanner.bannerImg,
        };

        await collection.updateOne({ _id: ObjectId.createFromHexString(bannerId) }, { $set: updatedBanner });

        return res.status(200).json({ success: true, message: "Banner updated successfully" });
    } catch (error) {
        console.error("editBanner.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { EditBanner };
