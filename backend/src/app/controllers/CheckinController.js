import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const { student_id } = req.params;

    const checkins = await Checkin.findAll({
      where: { student_id },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { student_id } = req.params;

    const checkin = await Checkin.create({
      student_id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
