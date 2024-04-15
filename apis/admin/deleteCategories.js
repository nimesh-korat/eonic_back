const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function DeleteCategory(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('categories');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { categoryId } = req.body;

        if (!ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, message: "Invalid Category ID!" });
        }

        const deletedCategory = await collection.updateOne({ _id: ObjectId.createFromHexString(categoryId) }, { $set: { status: "inactive" } });

        if (deletedCategory.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Category not found!" });
        }

        return res.status(200).json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        console.error("DeleteCategory.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { DeleteCategory };
