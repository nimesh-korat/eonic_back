const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ViewCategories(req, res) {
    try {
        const db = await connectDB();
        const categoryCollection = db.collection("categories");
        const productCollection = db.collection("products");

        const categories = await categoryCollection.aggregate([
            {
                $match: { status: "active" }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "products"
                }
            },
            {
                $addFields: {
                    productsActive: {
                        $filter: {
                            input: "$products",
                            as: "product",
                            cond: { $eq: ["$$product.status", "active"] }
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    categoryName: 1,
                    categoryImg: 1,
                    status: 1,
                    productCount: { $size: "$productsActive" }
                }
            }
        ]).toArray();

        if (categories.length === 0) {
            return res.status(400).json({ success: false, message: "Categories not found" });
        }

        res.status(200).json({
            categories,
            success: true,
            message: "Categories fetch Successful",
        });
    } catch (error) {
        console.log("ViewCategories.js: ", error);
        res.status(500).json({ success: false, message: "Enquiries fetch Failed" });
    }
}

module.exports = { ViewCategories };
