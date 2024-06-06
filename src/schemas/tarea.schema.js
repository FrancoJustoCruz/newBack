import { z } from 'zod'

const tareaSchema = z.object({
  title: z.string({
    required_error: 'Title is required'
  }),
  description: z.string({
    required_error: 'Description is required'
  }),
  deadline: z.string({
    required_error: 'Date is required'
  }).datetime()
})

const validateTarea = (data) => tareaSchema.safeParse(data)

// Validar datos parciales del usuario
const validatePartialTarea = (data) => tareaSchema.partial().safeParse(data)

export { validatePartialTarea, validateTarea }