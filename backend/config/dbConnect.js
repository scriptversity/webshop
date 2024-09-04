import mongoose from "mongoose";

export const connectDatabase = async () => {
  let DB_URI = "";

  if (process.env.NODE_ENV === "DEVELOPMENT") DB_URI = process.env.DB_LOCAL_URI;
  if (process.env.NODE_ENV === "PRODUCTION") DB_URI = process.env.DB_URI;

  try {
    await mongoose.connect(DB_URI).then((conn) => {
      console.log(
        `MongoDB Database connected with HOST: ${conn?.connection?.host}`
      );
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
