
const router = require('express').Router();
const { Thought, Reaction, User} = require('../../models')

//GET ALL THOUGHTS
router.get('/', (req,res)=> {
    Thought.find({}, (err, result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          console.log('Uh Oh, something went wrong');
          res.status(500).json({ error: 'Something went wrong' });
        }
      });
})

//CREATE A NEW THOUGHT
router.post('/', async (req,res)=> {
    console.log(req.body);
    const newThought = await Thought.create(req.body)
    console.log(newThought)
    await User.findOneAndUpdate(
      { username: req.body.username },
      { $push: { thoughts: newThought } },
      { new: true }
    );
    if (newThought) {
      res.status(200).json(newThought);
    } else {
      console.log('Uh Oh, something went wrong');
      res.status(500).json({ message: 'something went wrong' });
    }
});

//GET SINGLE THOUGHT BASED ON THOUGHT ID
router.get('/:thoughtId', (req,res)=> {
    Thought.findOne({ _id: req.params.thoughtId }, (err, result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          console.log('Uh Oh, something went wrong');
          res.status(500).json({ error: 'Something went wrong' });
        }
      });
})

//UPDATE A THOUGHT
router.put('/:thoughtId', (req,res)=> {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { thoughtText: req.body.thoughtText },
        { new: true },
        (err, result) => {
          if (result) {
            res.status(200).json(result);
            console.log(`Updated: ${result}`);
          } else {
            console.log('Uh Oh, something went wrong');
            res.status(500).json({ message: 'something went wrong' });
          }
        }
      );
})

//DELETE A THOUGHT BASED ON THOUGHT ID
router.delete('/:thoughtId', (req,res)=> {
Thought.findOneAndDelete({ _id: req.params.thoughtId })
  .then((thought) =>
  // console.log(thought)
    !thought
      ? res.status(404).json({ message: 'No thought with this id!' })
      : User.findOneAndUpdate(
          { username: thought.username },
          { $pull: { thoughts: {_id: req.params.thoughtId}} },
          { runValidators: true, new: true },
        )
  ).then((user) =>
    !user
      ? res
          .status(404)
          .json({ message: 'Thought deleted, but user does not exist' })
      : res.json({ message: 'Thought successfully deleted!' })
  )
  .catch((err) => res.status(500).json(err));
  // console.log(req.params.thoughtId)
});

//ADD REACTION TO A THOUGHT
router.post('/:thoughtId/reactions', async (req,res)=> {
  const newReaction = await Reaction.create(req.body);
  await Thought.findByIdAndUpdate(
    { _id: req.params.thoughtId },
    { $push: { reactions: newReaction } },
    { runValidators: true, new: true }
  )

  if (newReaction) {
    res.status(200).json(newReaction);
  } else {
    console.log('Uh Oh, something went wrong');
    res.status(500).json({ message: 'something went wrong' });
  }

});

//DELETE A REACTION ON A THOUGHT
router.delete('/:thoughtId/reactions/:reactionId', async (req,res)=> {
 const updatedThought = await Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { reactionId: req.params.reactionId } } },
    { runValidators: true, new: true }
  )
  if (updatedThought) {
    res.status(200).json(updatedThought);
  } else {
    console.log('Uh Oh, something went wrong');
    res.status(500).json({ message: 'something went wrong' });
  }
}
)

module.exports = router;
