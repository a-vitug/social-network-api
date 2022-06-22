const router = require('express').Router();
const {
    getThoughts,
    getOneThought,
    createThought,
    updateThought,
    deleteThought,
    createReaction,
    deleteReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getThoughts).post(createThought); // /api/thoughts

router.route('/:thoughtId').get(getOneThought).put(updateThought).delete(deleteThought); // /api/thoughts/:thoughtId 

router.route('/:thoughtId/reactions').post(createReaction); // /api/thoughts/:thoughtId/reactions

router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction); // /api/thoughts/:thoughtId/reactions/:reactionId

module.exports = router;