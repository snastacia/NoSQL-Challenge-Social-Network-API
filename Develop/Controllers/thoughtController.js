const { Thought, User } = require('../models');

module.exports = {
  // Get all thoughts
  async getThoughts(req, res) {
    try {

      const thoughts = await Thought.find()
      res.json(thoughts)

  } catch(err) {

      console.log('Error getting thought', err);
      return res.status(500).json(err)
  }
},

  // Get a thought
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .populate("reactions")

      if (!thought) {
        return res.status(404).json({ message: "No Thought with that ID" });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Create a thought
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      const user = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: thought._id } },
        { new: true }
     );
     if (!user) {
      return res.status(404).json({ error: "No user found with that id" });
     }
     res.json(thought);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  // Delete a thought
  async deleteThought(req, res) {
  try {
    const thought = await Thought.findOneAndDelete({
      _id: req.params.thoughtId,
    });
    if (!thought) {
      return res.status(404).json({ error: "No thought found with that id" });
    }
    const userData = await User.findOneAndUpdate(
      { thoughts: req.params.thoughtId },
      { $pull: { thoughts: req.params.thoughtId } },
      { new: true }
    );
    if (!userData) {
      return res.json({ error: "No user found with that id" });
    }
    return res.json({ message: "Thought deleted" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
},

  // Update a thought
  async updateThought(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res.status(404).json({ message: 'No thought with this id!' });
      }

      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Add reaction to a thought
async addReaction (req, res) {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { new: true, runValidators: true }
    );
    if (!thought) {
      return res.status(404).json({ error: "No thought found with that id" });
    }
    res.json(thought);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
},

// Remove reaction from a thought
async removeReaction (req, res) {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true, runValidators: true }
    );

    if (!thought) {
      return res.status(404).json({ error: "No Thought found with that id" });
    }
    return res.json(thought);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
};