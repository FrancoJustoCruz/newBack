const corsPermitidos=[
    'http://localhost:5173', 'thunder client', 'http://localhost:5173/login', 'http://localhost:5173/register', 'http://localhost:3000'
]

export const corsValidation = (req, res, next) => {
  const { origin } = req.headers
  console.log(origin)
  console.log(!origin || corsPermitidos.includes(origin))
  // Permitir acceso siempre desde localhost
  if (!origin || corsPermitidos.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS')
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    next()
  } else {
    return res.status(403).json({ message: 'Error de CORS' })
  }
}
