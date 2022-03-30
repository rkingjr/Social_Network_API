const router = require('express').Router();
const {getAllUsers,getUserById,createUsers,updateUsers,deleteUsers,addFriend,deleteFriend} = require('../../controllers/usersController');

router.route('/').get(getAllUsers).post(createUsers);
router.route('/:id').get(getUserById).put(updateUsers).delete(deleteUsers);
router.route('/:id/friends/:friendId').post(addFriend).delete(deleteFriend);

module.exports = router;
