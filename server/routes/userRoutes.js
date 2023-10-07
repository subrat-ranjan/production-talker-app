// const { default: SetAvatar } = require("../../client/src/pages/SetAvatar");
const { register, getAllUsers } = require("../controllers/usersController");
const { login } = require("../controllers/usersController")
const { setAvatar } = require("../controllers/usersController")

const router = require("express").Router();
router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allUsers/:id", getAllUsers); //this is a get request because we simply want the data 

module.exports = router;
