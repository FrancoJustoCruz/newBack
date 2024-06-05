import app from "./app.js";
import { connectDB } from "./db.js";



connectDB();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}`);
  console.log(`Documentación de la API disponible en http://localhost:${PORT}/api-docs`);
  
});