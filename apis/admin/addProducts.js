const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");


async function AddProduct(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('products');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { productName, productPrice, productDesc, categoryId, buyLink } = req.body;
        const productImgs = req.files.map(files => files.filename);

        if (!productName || !productPrice || !productDesc || !categoryId || !buyLink) {
            return res.status(400).json({ success: false, message: "Missing required fields!" });
        }

        if (req.files.length === 0) {
            return res.status(400).json({ success: false, message: "No images selected!" });
        }

        await collection.insertOne({
            productName,
            productPrice: parseFloat(productPrice),
            productDesc,
            productImgs,
            categoryId: ObjectId.createFromHexString(categoryId),
            status: "active",
            buyLink
        });

        return res.status(201).json({ success: true, message: "Product added successfully" });
    } catch (error) {
        console.error("addProducts.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { AddProduct };
