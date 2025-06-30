import { CorsOptions } from "cors";

const urlFrontend = process.env.FRONTEND_URL

export const corsOptions: CorsOptions = {
  origin: function(origin, callback) {    
    const whitelist = [urlFrontend]
    if (whitelist.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error("Error de CORS"))
    }
  }
}