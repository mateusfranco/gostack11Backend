import * as express from "express";
import appointmentsRouter from "./appointments.routes";
import usersRouter from "./users.routes";
import sessionsRouter from "./sessions.routes";

const routes = express.Router();

routes.use("/appointments", appointmentsRouter);
routes.use("/users", usersRouter);
routes.use("/session", sessionsRouter);
routes.get("/", (req, res) => res.json({ message: "funcionando" }));

export default routes;
