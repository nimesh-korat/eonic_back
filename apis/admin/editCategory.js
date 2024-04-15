const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function EditCategory(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('categories');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { categoryId, categoryName } = req.body;
        const categoryImg = req.file ? req.file.filename : undefined;

        if (!ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, message: "Invalid Category ID!" });
        }

        const existingCategory = await collection.findOne({ _id: ObjectId.createFromHexString(categoryId) });

        if (!existingCategory) {
            return res.status(404).json({ success: false, message: "Category not found!" });
        }

        const updatedCategory = {
            categoryName: categoryName || existingCategory.categoryName,
            categoryImg: categoryImg || existingCategory.categoryImg,
        };

        await collection.updateOne({ _id: ObjectId.createFromHexString(categoryId) }, { $set: updatedCategory });

        return res.status(200).json({ success: true, message: "Category updated successfully" });
    } catch (error) {
        console.error("EditCategory.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { EditCategory };
