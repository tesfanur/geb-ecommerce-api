//connect to db
import { connect } from "mongoose";
import { async } from "regenerator-runtime";
//add conditional statement which DB URI environement variable to use for local developement and production

const connectToDB = async () => {
  try {
    const connObj = await connect(process.env.MONGODB_LOCAL_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log(
      `MongoDB connected succefully! \n ${(await connObj).connection.host}`
    );
  } catch (error) {
    console.log(`Error occurred: ${error.message}`);
    process.exit(1);
  }
};

export default connectToDB;
