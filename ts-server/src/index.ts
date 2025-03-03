import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";
import { klubberRouter } from "./routes/users";
import connectToDb from "./services/conn";

dotenv.config();

// KJØR SERVER MED "node run dev"
const app: Express = express();
const port = process.env.PORT || 3000;

connectToDb()
    .then(() => {
        app.use("/klubber", klubberRouter);
        console.log("connected to db")
    })
    .catch((error: Error) => {
        console.error("Database connection failed", error);
        process.exit();
    });

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
