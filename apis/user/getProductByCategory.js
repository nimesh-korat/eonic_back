const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function GetProductsByCategory(req, res) {
    try {
        const db = await connectDB();
        const productsCollection = db.collection('products');
        const categoriesCollection = db.collection('categories');

        const { categoryId } = req.body;

        // Check if the provided categoryId is a valid ObjectId
        if (!ObjectId.isValid(categoryId)) {
            return res.status(400).json({ success: false, message: "Invalid category ID" });
        }

        // Check if the category exists
        const category = await categoriesCollection.findOne({ _id: ObjectId.createFromHexString(categoryId) });
        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }

        // Find products by categoryId
        const products = await productsCollection.find({ categoryId: ObjectId.createFromHexString(categoryId), status: "active" }).toArray();

        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found for this category" });
        }

        return res.status(200).json({ products, success: true, message: "Products fetched successfully" });

    } catch (error) {
        console.error("GetProductsByCategory.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { GetProductsByCategory };
