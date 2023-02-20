
const router = require('express').Router();
const { Thought, Reaction, User} = require('../../models')

//TODO: ROUTE TO GET ALL THOUGHTS
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

//TODO: ROUTE TO CREATE A NEW THOUGHT
router.post('/', async (req,res)=> {
    console.log(req.body);
    const newThought = await Thought.create(req.body)
    console.log(newThought)
    await User.findOneAndUpdate(
      { username: req.body.username },
      { $push: { thoughts: newThought._id } },
      { new: true }
    );
    if (newThought) {
      res.status(200).json(newThought);
    } else {
      console.log('Uh Oh, something went wrong');
      res.status(500).json({ message: 'something went wrong' });
    }
});

//TODO: ROUTE TO GET SINGLE THOUGHT BASED ON THOUGHT ID
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

//TODO: ROUTE TO UPDATE A THOUGHT
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

//TODO: ROUTE TO DELETE A THOUGHT BASED ON THOUGHT ID
router.delete('/:thoughtId', (req,res)=> {
    Thought.findOneAndDelete(
        { name: req.params.thoughtId },
        (err, result) => {
          if (result) {
            res.status(200).json(result);
            console.log(`Deleted: ${result}`);
          } else {
            console.log('Uh Oh, something went wrong');
            res.status(500).json({ error: 'Something went wrong' });
          }
        }
      );
});

//TODO: ROUTE TO ADD REACTION TO A THOUGHT
router.post('/:thoughtId/reactions', (req,res)=> {
  Reaction.create(req.body)
  .then((reaction) => {
    return Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reaction: reaction._id } },
      { runValidators: true, new: true }
    );
  })
  .then((thought) =>
    !thought
      ? res
          .status(404)
          .json({ message: 'reaction created, but no thoughts with this ID' })
      : res.json({ message: 'reaction created' })
  )
  .catch((err) => {
    console.error(err);
  });
});

//TODO: ROUTE TO DELETE A REACTION ON A THOUGHT
router.delete('/:thoughtId/reactions/:reactionId', (req,res)=> {
  Thought.findOneAndUpdate(
    { _id: req.params.thoughtId },
    { $pull: { reactions: { _id: req.params.reactionId } } },
    { runValidators: true, new: true }
  )
    .then((reaction) =>
      !reaction
        ? res.status(404).json({ message: 'No reaction with this id!' })
        : res.json(reaction)
    )
    .catch((err) => res.status(500).json(err));
}
)

module.exports = router;
