import mongoose from 'mongoose'

const tareaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    deadline: {
      type: Date,
      require: true
    },
    teacher: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      require: true
    }
  },
  {
    timestamps: true
  }
)

const Tarea = mongoose.model('Tarea', tareaSchema)

export default Tarea