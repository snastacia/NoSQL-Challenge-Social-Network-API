const mongoose = require('mongoose');
const { Schema } = mongoose;
const reactionSchema = require('./reaction')

const ThoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: (createdAtVal) => createdAtVal.toLocaleString(),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
    }
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

ThoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});


const Thought = mongoose.model('Thought', ThoughtSchema);
module.exports = Thought;
