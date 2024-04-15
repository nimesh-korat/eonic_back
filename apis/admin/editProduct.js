const connectDB = require("../../db/dbConnect");
const { ObjectId } = require("mongodb");

async function EditProduct(req, res) {
  try {
    const db = await connectDB();
    const collection = db.collection("products");

    const userId = req.session.user;
    if (!userId) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized User!" });
    }

    const { productId, productName, productPrice, productDesc, buyLink } =
      req.body;
    const productImgs = req.files.map((files) => files.filename);

    if (!ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Product ID!" });
    }

    const existingProduct = await collection.findOne({
      _id: ObjectId.createFromHexString(productId),
    });

    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    const updatedProduct = {
      productName: productName || existingProduct.productName,
      productPrice:
        parseFloat(productPrice) || parseFloat(existingProduct.productPrice),
      productDesc: productDesc || existingProduct.productDesc,
      buyLink: buyLink || existingProduct.buyLink,
      productImgs:
        productImgs.length > 0 ? productImgs : existingProduct.productImgs,
    };

    await collection.updateOne(
      { _id: ObjectId.createFromHexString(productId) },
      { $set: updatedProduct }
    );

    return res
      .status(200)
      .json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("editProducts.js: ", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
}

module.exports = { EditProduct };
