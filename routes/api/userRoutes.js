const router = require('express').Router();
const {
    getUsers,
    getOneUser,
    createUser,
    updateUser,
    deleteUser,
    addFriend,
    deleteFriend,
} = require('../../controllers/userController');

router.route('/').get(getUsers).post(createUser); // /api/users

router.route('/:userId').get(getOneUser).put(updateUser).delete(deleteUser); // /api/users/:userId

router.route('/:userId/friends/:friendId').post(addFriend).delete(deleteFriend); // /api/users/:userId/friends/:friendId

module.exports = router;