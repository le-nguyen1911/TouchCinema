import mongoose from "mongoose";
const connectdb = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("Database connected"));
    await mongoose.connect(`${process.env.MONGO_URL}/touchcinema`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectdb;
