const mongoose = require('mongoose');

const toJSONTransform = (_doc, ret) => {
  ret.id = ret._id.toString();
  delete ret._id;
};

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      transform: toJSONTransform,
    },
  },
);

const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);

module.exports = Note;
