const connectDB = require("../../db/dbConnect");

async function AddCategories(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('categories');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { categoryName } = req.body;
        const categoryImg = req.file.filename;

        if (!categoryName || !categoryImg) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        await collection.insertOne({
            categoryName,
            categoryImg,
            status: "active",
        });

        return res.status(201).json({ success: true, message: "Category added successfully" });
    } catch (error) {
        console.error("AddCategories.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { AddCategories };
