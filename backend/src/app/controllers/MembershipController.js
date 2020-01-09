import * as Yup from 'yup';
import { startOfDay, isBefore, addMonths, parseISO } from 'date-fns';
import Membership from '../models/Membership';
import Plan from '../models/Plan';
import Student from '../models/Student';

import MembershipMail from '../jobs/MembershipMail';
import Queue from '../../lib/Queue';

class MembershipController {
  async index(req, res) {
    const membership = await Membership.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
    });
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

    const mbsExists = await Membership.findOne({
      where: { student_id: student.id },
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['title'],
        },
      ],
    });

    if (mbsExists) {
      return res.status(400).json({
        message: `Student ${student.name} already has the ${mbsExists.plan.title} plan!`,
      });
    }

    const plan = await Plan.findByPk(plan_id);

    const price = plan.duration * plan.price;

    const start_date_parsed = parseISO(start_date);

    if (isBefore(start_date_parsed, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Past date are note permitted!' });
    }

    const end_date_parsed = addMonths(start_date_parsed, plan.duration);

    const membership = await Membership.create({
      student_id: student.id,
      plan_id: plan.id,
      start_date: start_date_parsed,
      end_date: end_date_parsed,
      price,
    });

    await Queue.add(MembershipMail.key, {
      student,
      plan,
      membership,
    });

    return res.json(membership);
  }

  async update(req, res) {
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

    const membership = await Membership.findByPk(req.params.id);

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    const plan = await Plan.findByPk(plan_id);

    const price = plan.duration * plan.price;

    const start_date_parsed = parseISO(start_date);

    if (isBefore(start_date_parsed, startOfDay(new Date()))) {
      return res.status(400).json({ error: 'Past date are note permitted!' });
    }

    const end_date_parsed = addMonths(start_date_parsed, plan.duration);

    await membership.update({
      student_id: student.id,
      plan_id: plan.id,
      start_date: start_date_parsed,
      end_date: end_date_parsed,
      price,
    });

    return res.json(membership);
  }

  async delete(req, res) {
    const membership = await Membership.findByPk(req.params.id);

    membership.destroy();

    return res.json({ message: 'Membership removed!' });
  }
}

export default new MembershipController();
