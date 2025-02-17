import express, {Express, Request, Response} from "express";
import dotenv from "dotenv";

dotenv.config();

// KJØR SERVER MED "node run dev"
const app: Express = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
    console.log('[GET ROUTE]');
    res.send('Hei hallo lmao');

});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
