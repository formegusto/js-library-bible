import { Router } from "express";
import FileRoutes from "./file";

const Routes = Router();

Routes.use("/file", FileRoutes);

export default Routes;
