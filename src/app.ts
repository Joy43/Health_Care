import express, { Application, Request, Response } from "express";
import cors from 'cors';
import { userRoutes } from "./app/modules/User/user.routes";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";

const app:Application=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// ------------- root route--------
app.get('/ ', (req: Request, res: Response) => {
res.send({
    Message:"health care server --start"
})
});

// --------------route-------------
app.use('/api/v1/user',userRoutes);
app.use('/api/v1/admin',AdminRoutes);

export default app;