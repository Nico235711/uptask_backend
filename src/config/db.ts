import mongoose from "mongoose";
process.loadEnvFile()

export const connectDB = async () => { 
  try {
    await mongoose.connect(process.env.DATABASE_URL!)
    console.log("Conexión exitosa a mongoDB");
  } catch (error) {
    console.log(`Error al conectar con la DB: ${error}`);
    process.exit(1)
  }
}