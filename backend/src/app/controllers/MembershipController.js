import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Membership from '../models/Membership';
import Plan from '../models/Plan';
import Student from '../models/Student';

class MembershipController {
  async index(req, res) {
    const membership = await Membership.findAll();
    return res.json(membership);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .required()
        .positive(),
      plan_id: Yup.number()
        .required()
        .positive(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed!' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);
    const plan = await Plan.findByPk(plan_id);

    const price = plan.duration * plan.price;

    const start_date_parsed = parseISO(start_date);

    const end_date_parsed = addMonths(parseISO(start_date), plan.duration);

    const membership = await Membership.create(
      {
        student: {},
        plan: plan.id,
        start_date: start_date_parsed,
        end_date: end_date_parsed,
        price,
      },
      {
        include: [
          {
            model: Student,
            as: 'students',
            attributes: ['name', 'email'],
          },
          {
            model: Plan,
            as: 'plans',
            include: ['title'],
          },
        ],
      }
    );

    return res.json(membership);
  }
}

export default new MembershipController();
