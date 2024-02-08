const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  login,
} = require("./user.contoller");
const router = require("express").Router();
const { checkToken } = require("../../auth/token_validation");

router.get("/", checkToken, getUsers);
router.post("/", checkToken, createUser);
router.get("/:id", checkToken, getUserById);
router.patch("/", checkToken, updateUser);
router.delete("/", checkToken, deleteUser);

router.post("/login", login);

module.exports = router;
