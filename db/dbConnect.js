const { MongoClient } = require("mongodb");

const connectDB = async () => {
  const dbUrl = "mongodb+srv://koratnimesh30:Nimesh123@cluster0.ayot4f5.mongodb.net/EonicIndia";
  try {
    const client = await MongoClient.connect(dbUrl);
    console.log("DB Connected");
    return client.db(); // Return the db object for further usage
  } catch (error) {
    console.log("DB connection Error: ", error);
    throw error;
  }
};
module.exports = connectDB;
