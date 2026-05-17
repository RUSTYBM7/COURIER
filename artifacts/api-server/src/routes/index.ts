import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import shipmentsRouter from "./shipments";
import trackingRouter from "./tracking";
import messagesRouter from "./messages";
import paymentsRouter from "./payments";
import dashboardRouter from "./dashboard";
import adminRouter from "./admin";
import settingsRouter from "./settings";
import contentRouter from "./content";
import emailsRouter from "./emails";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(shipmentsRouter);
router.use(trackingRouter);
router.use(messagesRouter);
router.use(paymentsRouter);
router.use(dashboardRouter);
router.use(adminRouter);
router.use(settingsRouter);
router.use(contentRouter);
router.use(emailsRouter);

export default router;
