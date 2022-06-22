const { User, Thought } = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find()
            .then((userData) => res.json(userData))
            .catch((err) => res.status(500).json(err));
    },
    getOneUser(req, res) {
        User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('thoughts')
            .populate('friends')
            .then((userData) =>
                !userData
                    ? res.status(404).json({ message: 'No user found with this id' })
                    : res.json(userData)
            )
            .catch((err) => res.status(500).json(err));
    },
    createUser(req, res) {
        User.create(req.body)
            .then((userData) => res.json(userData))
            .catch((err) => res.status(500).json(err));
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId }, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        )
        .then(userData => {
            if(!userData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(userData);
        })
        .catch((err) => res.status(500).json(err));
    },
    deleteUser(req, res) {
        Thought.deleteMany({ _id: req.params.userId })
            .then(() => {
                 User.findOneAndDelete({ _id: req.params.userId })
                    .then((userData) => {
                        if(!userData) {
                            res.status(404).json({ message: 'No user found with this id' });
                            return;
                        }
                        res.json({ message: "User deleted", userData});
                    });
            })
            .catch(err => res.json(err));
    },
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true }
        )
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({ message: 'No user found with this id' });
              }
              res.json(userData);
            })
            .catch((err) => {
              res.status(500).json(err);
            });
    },
    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
        .then((userData) => {
            if (!userData) {
                return res.status(404).json({ message: 'No user found with this id' });
              }
              res.json({ message: 'Friend deleted', userData});
            })
            .catch((err) => {
              res.status(500).json(err);
            });
    }
};