import mongoose from "mongoose";

export const connectDB = () =>
  mongoose
    .connect(process.env.databaseURL, {
      dbName: "APIScripter",
    })
    .then((c) => {
      console.log(
        `Database connected with ${c.connection.host}: ${c.connection.port}`
      );
    })
    .catch((e) => {
      console.log(e);
    });
