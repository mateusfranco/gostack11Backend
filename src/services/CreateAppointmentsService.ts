import { getCustomRepository } from "typeorm";
import { startOfHour } from "date-fns";
import Appointment from "../models/Appointments";
import AppointmentRepository from "../repositories/AppointmentsRepository";
import AppError from "../errors/AppError";

interface Request {
  provider: string;
  date: Date;
}

class CreateAppointmentsService {
  public async execute({ date, provider }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentRepository);

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate
    );

    if (findAppointmentInSameDate) {
      throw new AppError("this appointment is already booked");
    }

    const appointment = appointmentsRepository.create({
      provider,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentsService;
