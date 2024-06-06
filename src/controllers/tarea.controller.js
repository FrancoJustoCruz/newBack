import Tarea from '../models/tarea.model.js'
import User from '../models/user.model.js'
import { validatePartialTarea, validateTarea } from '../schemas/tarea.schema.js'

export const getMyTareas = async (req, res) => {
  try {
    const tareas = await Tarea.find({ teacher: req.user.id }).populate('teacher', 'username name lastName -_id')
    res.json(tareas)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getTareasAssigned = async (req, res) => {
  try {
    const student = await User.findById(req.user.id)

    if (!student.teacherAssigned) {
      return res.status(400).json({ message: 'you dont have a teacher assigned' })
    }

    const tareas = await Tarea.find({ teacher: student.teacherAssigned }).populate('teacher', 'username name lastName -_id')
    res.json(tareas)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const createTarea = async (req, res) => {
  try {
    const result = validateTarea(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      return res.status(400).json({ errors: errorMessages })
    }

    result.data.teacher = req.user.id

    const newTarea = new Tarea({
      ...result.data
    })

    const saveTarea = await newTarea.save()
    res.json(saveTarea)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const deleteTarea = async (req, res) => {
  try {
    const { tareaId } = req.params
    const deletedTarea = await Tarea.findByIdAndDelete(tareaId)
    if (!deletedTarea) { return res.status(404).json({ message: 'Tarea not found' }) }

    return res.sendStatus(204)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const updateTarea = async (req, res) => {
  try {
    const { tareaId } = req.params
    const result = validatePartialTarea(req.body)

    if (!result.success) {
      const errorMessages = result.error.issues.map(err => ({ path: err.path[0], message: err.message }))
      return res.status(400).json({ errors: errorMessages })
    }

    const prevTareaData = await Tarea.findById(tareaId)
    if (req.user.id !== prevTareaData.teacher._id.toString()) {
      return res.status(401).json({ message: 'You are not allow to update this tarea, authorization denied' })
    }

    const tareaUpdated = await Tarea.findOneAndUpdate({ _id: tareaId }, result.data, { new: true }).populate('teacher', 'username name lastName -_id')

    return res.json(tareaUpdated)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

export const getTarea = async (req, res) => {
  try {
    const { tareaId } = req.params

    const tarea = await Tarea.findById({ _id: tareaId }).populate('teacher', 'username name lastName -_id')
    if (!tarea) return res.status(404).json({ message: 'Tarea not found' })
    return res.json(tarea)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}