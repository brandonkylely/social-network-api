
const router = require('express').Router();
const {User} = require("../../models")

//GETS ALL THE USERS
router.get('/', (req,res)=> {
    User.find({}, (err, result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          console.log('Uh Oh, something went wrong');
          res.status(500).json({ error: 'Something went wrong' });
        }
      });
})

//CREATES A NEW USER
router.post('/', async(req,res)=> {
    console.log(req.body);
    const newUser = await User.create(req.body)
    console.log(newUser)
    if (newUser) {
      res.status(200).json(newUser);
    } else {
      console.log('Uh Oh, something went wrong');
      res.status(500).json({ message: 'something went wrong' });
    }
});

//GETS A SINGLE USER BASED ON USER ID
router.get('/:userId', (req,res) => {
    User.findOne({ _id: req.params.userId }, (err, result) => {
        if (result) {
          res.status(200).json(result);
        } else {
          console.log('Uh Oh, something went wrong');
          res.status(500).json({ error: 'Something went wrong' });
        }
      }).select('-__v')
      .populate('thoughts');
})

//UPDATES A SINGLE USER
router.put('/:userId', (req,res)=> {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
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

//DELETES A SINGLE USER BASED ON USER ID
router.delete('/:userId', (req,res)=> {
    User.findOneAndDelete(
        { name: req.params.userId },
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

//ADDS A FRIEND TO A USER
router.put('/:userId/friends/:friendId', async (req,res)=> {
  const newFriend = await User.findOneAndUpdate(
    { _id: req.params.userId },
    { $addToSet: { friends: req.params.friendId } },
    { new: true }
  )
  const newFriend2 = await User.findOneAndUpdate(
    { _id: req.params.friendId },
    { $addToSet: { friends: req.params.userId } },
    { new: true }
  )
  // console.log(newFriend)
  if (newFriend && newFriend2) {
    res.status(200).json(newFriend);
  } else {
    console.log('Uh Oh, something went wrong');
    res.status(500).json({ message: 'something went wrong' });
  }
})

//DELETES A FRIEND FROM A USER'S FRIENDS, DONT DELETE THE FRIEND AS A USER THOUGH!
router.delete('/:userId/friends/:friendId', async (req,res)=> {
  const newFriend = await User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { friends: req.params.friendId } },
    { new: true }
  )
  const newFriend2 = await User.findOneAndUpdate(
    { _id: req.params.friendId },
    { $pull: { friends: req.params.userId } },
    { new: true }
  )
  // console.log(newFriend)
  if (newFriend && newFriend2) {
    res.status(200).json(newFriend);
  } else {
    console.log('Uh Oh, something went wrong');
    res.status(500).json({ message: 'something went wrong' });
  }
});

module.exports = router;
