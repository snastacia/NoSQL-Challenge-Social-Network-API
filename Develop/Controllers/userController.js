// const { ObjectId } = require('mongoose').Types;
const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
        const users = await User.find().populate('thoughts').populate('friends')
        res.json(users);
    } catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
},

  // Get a single user
  async getSingleUser (req, res) {
    try {
        const user = await User.findOne({_id: req.params.userId})
            .select('-__v');

        if (!user) {
            return res.status(404).json({message: 'No user with this ID'})
        }
        res.json(user)
    } catch(err) {
        console.log(err)
        res.status(500).json(err)
    }
},

  // create a new user
  async createUser (req, res) {

    try{
        const user = await User.create(req.body)
        res.json(user)
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }   
},

  // Update a user
  async updateUser (req, res) {
    try {
        let updatedUser =  await User.findByIdAndUpdate(
            req.params.userId,
            {$set : req.body},
            {new: true, runValidators: true});
        
        if (!updatedUser) {
            res.status(404).json({message: 'No user found with this ID'})
        }
        res.json(updatedUser)
    } catch(err){
        console.log(err)
        res.status(500).json(err)
    }
},

  // Delete a user 
  async deleteUser (req, res) {
    try{
        const user = await User.findOneAndRemove({ _id: req.params.userId})

        if (!user) {
            return res.status(404).json({ message: 'No user found with this ID' })
        }

        const thought = await Thought.deleteMany({ _id: { $in: user.thoughts }})

        if (!thought) {
            return res.status(404).json({message: 'User deleted but no thoughts found'})
        }

        res.json({message: 'User and associated thoughts successfully deleted'})
    }catch(err){
        console.log(err)
        res.status(500).json(err)
    }
},
 
  // Add Friend
  async addFriend (req, res) {
    console.log('You are adding a friend')
    console.log(req.params)

    try{
        const user = await User.findOneAndUpdate(
            {_id : req.params.userId},
            {$addToSet: {friends: req.params.friendId}},
            {runValidators:true, new: true}
        )
        if (!user){
            res.status(404).json({message: 'No user was found with this ID'})
        }
        res.json(user)
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
},

  // Remove friend
  async removeFriend (req, res) {
    console.log('You are removing a friend');
    console.log(req.params);
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );
  
      if (!user) {
        res.status(404).json({ message: 'No user found with this ID' });
      }
      res.json({ message: 'Friend removed', user });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }   
};