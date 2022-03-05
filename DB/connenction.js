const mongoose = require("mongoose");
// mongodb+srv://nourhan:Test1234@cluster0.lri9y.mongodb.net/test

let connection = () => {
    return mongoose
      .connect(process.env.CONNECT_STRING_ONLINE)
      .then(() => console.log("connected"))
      .catch((err) => console.log(err));
}


module.exports = connection;