import { Router, type IRouter } from "express";
import healthRouter from "./health";
import activitiesRouter from "./activities";
import categoriesRouter from "./categories";
import enquiriesRouter from "./enquiries";
import adminRouter from "./admin";
import storageRouter from "./storage";
import teeRouter from "./tee";

const router: IRouter = Router();

router.use(healthRouter);
router.use(activitiesRouter);
router.use(categoriesRouter);
router.use(enquiriesRouter);
router.use(adminRouter);
router.use(storageRouter);
router.use(teeRouter);

export default router;
