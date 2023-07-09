const router = require('express').Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/userController");

router.route('/').get(getUsers).post(createUser)

// /api/users
router
  .route('/:userId')
  .get(getSingleUser) 
  .put(updateUser)
  .post(createUser) 
  .delete(deleteUser)

// api/users/:userId/:friendId
  router
  .route('/:userId/firends/:friendId')
  .post(addFriend) 
  .delete(removeFriend); 

module.exports = router;