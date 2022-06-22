const { Thought, User } = require('../models');

module.exports = {
    getThoughts(req, res) {
        Thought.find({})
            .sort({ createdAt: -1 })
            .then((thoughtData) => res.json(thoughtData))
            .catch((err) => res.status(500).json(err))
    },
    getOneThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
            .then((thoughtData) => {
                if (!thoughtData) {
                    return res.status(404).json({ message: 'No thought found with this id'})
                }
                res.json(thoughtData)
            })
            .catch((err) => res.status(500).json(err))
    },
    createThought(req, res) {
        Thought.create(req.body)
            .then((thoughtData) => {
                console.log(thoughtData)
                return User.findOneAndUpdate(
                    { _id: req.body.userId },
                    { $push: { thoughts: thoughtData._id }},
                    { new: true }
                )
            })
            .then((userData) => {
                if (!userData) {
                    return res.json(404).json({message: 'No user found with this id'})
                }
                res.json({ message: 'Successfully created thought' });
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json(err)
            })
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId},
            { $set: req.body },
            { new: true, runValidators: true }
        )
        .then((thoughtData) => {
            if (!thoughtData) {
                res.json(404).json({message: 'No thought found with this id'});
                return;
            }
            res.json(thoughtData);
        })
        .catch((err) => res.status(500).json(err))
    },
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId})
            .then((thoughtData) => {
                if (!thoughtData) {
                    return res.json(404).json({message: 'No thought found with this id'})
                }
                return User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId }},
                    { new: true }
                )
            })
            .then((userData) => {
                if (!userData) {
                    return res.json(404).json({message: 'No user found with this id'})
                }
                res.json({ message: 'Successfully deleted'});
            })
            .catch((err) => res.status(500).json(err))
    },
    createReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $push: { reactions: req.body }},
            { new: true, runValidators: true }
        )
        .then((thoughtData) => {
            if (!thoughtData) {
                return res.json(404).json({message: 'No thought found with this id'})
            }
            res.json({ message: 'Successfully created reaction'})
        })
        .catch((err) => res.status(500).json(err));
    },
    deleteReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.params.reactionId } }},
            { new: true, runValidators: true }
        )
        .then((thoughtData) => {
            if (!thoughtData) {
                return res.json(404).json({message: 'No thought found with this id'})
            }
            res.json({ message: 'Successfully deleted reaction', thoughtData});
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json(err)
        });
    }
}