const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
require("dotenv").config();
const jwtConfig = require("./jwt.Config");

const loginRoute = require("./routes/loginRoute");
const signupRoute = require("./routes/signupRoute");
const guestRoute = require("./routes/guestRoute");
const userRoute = require("./routes/userRoute");
const discoverRoute = require("./routes/discoverRoute");
const commentRoute = require("./routes/commentsRoute");
const allUsers = require("./routes/allUsersRoute");
const updateUserRoute = require("./routes/updateUserRoute");
const deleteUserRoute = require("./routes/deleteUserRoute");
const profileRoute = require("./routes/profileRoute");

app.use("/api/login", loginRoute);
app.use("/api/signup", signupRoute);
app.use("/api/guest", guestRoute);
app.use("/api/user", jwtConfig, userRoute);
app.use("/api/discover", jwtConfig, discoverRoute);
app.use("/api/comments", jwtConfig, commentRoute);
app.use("/api/all-users", allUsers);
app.use("/api/update-user", jwtConfig, updateUserRoute);
app.use("/api/delete-user", jwtConfig, deleteUserRoute);
app.use("/api/profile", jwtConfig, profileRoute);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
