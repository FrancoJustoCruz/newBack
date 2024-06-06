import { Router } from 'express'
import { createTarea, deleteTarea, getMyTareas, getTarea, getTareasAssigned, updateTarea } from '../controllers/tarea.controller.js'
import { auth } from '../middlewares/auth.middleware.js'
import { isATeacher } from '../middlewares/isATeacher.middleware.js'

const router = Router()

router.get('/tareas', auth, isATeacher, getMyTareas)

router.get('/tareas/tareasAssigned', auth, getTareasAssigned)

router.post('/tareas', auth, isATeacher, createTarea)

router.get('/tareas/:tareaId', auth, getTarea)

router.patch('/tareas/:tareaId', auth, isATeacher, updateTarea)

router.delete('/tareas/:tareaId', auth, isATeacher, deleteTarea)

export default router