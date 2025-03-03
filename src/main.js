import express from "express";
import { database_connection } from "./DB/connection.js";
import routerhandler from "./utils/router-handler.js";
import { config } from "dotenv";

 config()



const bootStrap =async() => {
    const app =express()
    app.use(express.json())
    routerhandler(app)
    await  database_connection()


    app.listen(process.env.PORT,() => console.log('server is running on port ',process.env.PORT))
}
export default bootStrap