const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function DeleteProduct(req, res) {
    try {
        const db = await connectDB();
        const collection = db.collection('products');

        const userId = req.session.user;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized User!" });
        }

        const { productId } = req.body;

        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({ success: false, message: "Invalid Product ID!" });
        }

        const deletedProduct = await collection.updateOne({ _id: ObjectId.createFromHexString(productId) }, { $set: { status: "inactive" } });

        if (deletedProduct.modifiedCount === 0) {
            return res.status(404).json({ success: false, message: "Product not found!" });
        }

        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("deleteProduct.js: ", error);
        return res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

module.exports = { DeleteProduct };
