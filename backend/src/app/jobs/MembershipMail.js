import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class MembershipMail {
  get key() {
    return 'MembershipMail';
  }

  async handle({ data }) {
    const { membership, plan, student } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Bem vindo a academia Gympoint!',
      template: 'membership',
      context: {
        student: student.name,
        plan: plan.title,
        start_date: format(parseISO(membership.start_date), 'dd/MM/uuuu', {
          locale: pt,
        }),
        end_date: format(parseISO(membership.end_date), 'dd/MM/uuuu', {
          locale: pt,
        }),
        price: plan.price,
        total_price: membership.price,
      },
    });
  }
}

export default new MembershipMail();
