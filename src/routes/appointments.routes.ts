import { Router } from "express";
import { parseISO } from "date-fns";
import { getCustomRepository } from "typeorm";
import AppointmentRepository from "../repositories/AppointmentsRepository";
import CreateAppointmentsService from "../services/CreateAppointmentsService";
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.get("/", async (req, res) => {
  const appointmentsRepository = getCustomRepository(AppointmentRepository);
  const appointments = await appointmentsRepository.find();
  return res.json(appointments);
});

appointmentsRouter.post("/", async (req, res) => {
  const { provider, date } = req.body;
  const parsedDate = parseISO(date);

  const createAppointment = new CreateAppointmentsService();

  const appointment = await createAppointment.execute({
    date: parsedDate,
    provider,
  });
  return res.json(appointment);
});

export default appointmentsRouter;
