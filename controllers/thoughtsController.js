const {thoughts,users} = require('../models');
const thoughtsController = {
    createThoughts({params,body}, res) {
        thoughts.create(body)
        .then(({_id}) => {
            return users.findOneAndUpdate({_id:params.userId},{$push:{thoughts:_id}},{new:true});
        })
        .then(dbThoughtsInfo => {
            if(!dbThoughtsInfo) {
                res.status(404).json({message:'There are no thoughts with this ID!'});
                return;
            }
            res.json(dbThoughtsInfo)
        })
        .catch(err => res.json(err));
    },

    getAllThoughts(req,res) {
        thoughts.find({})
        .populate({path:'reactions',select:'-__v'})
        .select('-__v')
        .then(dbThoughtsInfo => res.json(dbThoughtsInfo))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    },

    getThoughtsById({params}, res) {
        thoughts.findOne({_id:params.id})
        .populate({path:'reactions',select:'-__v'})
        .select('-__v')
        .then(dbThoughtsInfo => {
            if(!dbThoughtsInfo) {
            res.status(404).json({message:'There are no thoughts with this ID!'});
            return;
        }
        res.json(dbThoughtsInfo)
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(400);
        });
    },

    updateThoughts({params,body},res) {
        thoughts.findOneAndUpdate({_id:params.id},body,{new:true,runValidators:true})
        .populate({path:'reactions', select:'-__v'})
        .select('-___v')
        .then(dbThoughtsInfo => {
            if (!dbThoughtsInfo) {
                res.status(404).json({message:'No thoughts with this particular ID!'});
                return;
            }
                res.json(dbThoughtsInfo);
        })
        .catch(err => res.json(err));
    },

    deleteThoughts({params},res) {
        thoughts.findOneAndDelete({_id:params.id})
        .then(dbThoughtsInfo => {
            if (!dbThoughtsInfo) {
                res.status(404).json({message:'There are no thoughts with this  ID!'});
                return;
            }
            res.json(dbThoughtsInfo);
            })
            .catch(err => res.status(400).json(err));
    },

    addReaction({params,body},res) {
        thoughts.findOneAndUpdate({_id:params.thoughtId},{$push:{reactions:body}},{new:true,runValidators:true})
        .populate({path:'reactions',select:'-__v'})
        .select('-__v')
        .then(dbThoughtsInfo => {
        if (!dbThoughtsInfo) {
            res.status(404).json({message:'There are no thoughts with this ID!'});
            return;
        }
        res.json(dbThoughtsInfo);
        })
        .catch(err => res.status(400).json(err))

    },

    deleteReaction({params},res) {
        thoughts.findOneAndUpdate({_id:params.thoughtId},{$pull:{reactions:{reactionId:params.reactionId}}},{new : true})
        .then(dbThoughtsInfo => {
            if (!dbThoughtsInfo) {
                res.status(404).json({message:'There are no thoughts with this ID!'});
                return;
            }
            res.json(dbThoughtsInfo);
        })
        .catch(err => res.status(400).json(err));
    }
};

module.exports = thoughtsController;
