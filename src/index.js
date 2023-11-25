import app from "./app.js";
import connectDB from "./config/dbConnect.js";

const port = process.env.PORT || 5000;

const main = async () => {
  let server;
  try {
    const isConnected = await connectDB();

    server = app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    console.log("Database not connected");
    process.exit(1);
  }
};

main();
