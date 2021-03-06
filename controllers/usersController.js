const {users} = require('../models');
const usersController = {
    createUsers({body},res) {
        users.create(body)
        .then(dbUsersInfo => res.json(dbUsersInfo))
        .catch(err => res.status(400).json(err));
    },

    getAllUsers(req,res) {
        users.find({})
        .populate({path:'thoughts',select:'-__v'})
        .populate({path:'friends',select:'-__v'})
        .select('-__v')
        .then(dbUsersInfo => res.json(dbUsersInfo))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    getUsersById({params},res) {
        users.findOne({_id:params.id })
        .populate({path:'thoughts',select:'-__v'})
        .populate({path:'friends',select:'-__v'})
        .select('-__v')
        .then(dbUsersInfo => {
            if(!dbUsersInfo) {
                res.status(404).json({message:'There is no user with this ID!'});
                return;
            }
            res.json(dbUsersInfo)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err)
        })
    },

    // Update a current User by ID
    updateUsers({params,body}, res) {
        users.findOneAndUpdate({_id:params.id},body,{new:true,runValidators:true})
        .then(dbUsersInfo => {
            if(!dbUsersInfo) {
                res.status(404).json({message:'There is no user with this ID!'});
                return;
            }
            res.json(dbUsersInfo);
        })
        .catch(err => res.json(err))
    },

    deleteUsers({params}, res) {
        users.findOneAndDelete({_id:params.id})
        .then(dbUsersInfo => {
            if(!dbUsersInfo) {
                res.status(404).json({message:'There is no user with this ID!'});
                return;
            }
            res.json(dbUsersInfo);
        })
        .catch(err => res.status(400).json(err));
    },

    addFriend({params},res) {
        users.findOneAndUpdate({_id:params.id},{$push:{friends:params.friendId}},{new: true})
        .populate({path:'friends',select:('-__v')})
        .select('-__v')
        .then(dbUsersInfo => {
            if (!dbUsersInfo) {
                res.status(404).json({message:'There is no user with this ID!'});
                return;
            }
        res.json(dbUsersInfo);
        })
        .catch(err => res.json(err));
    },

    deleteFriend({ params }, res) {
        users.findOneAndUpdate({_id:params.id},{$pull:{friends:params.friendId}},{new: true})
        .populate({path:'friends',select:'-__v'})
        .select('-__v')
        .then(dbUsersInfo => {
            if(!dbUsersInfo) {
                res.status(404).json({message:'There is no user with this ID!'});
                return;
            }
            res.json(dbUsersInfo);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = usersController;
