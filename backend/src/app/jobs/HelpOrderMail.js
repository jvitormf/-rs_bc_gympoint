import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail';
  }

  async handle({ data }) {
    const { helpOrder } = data;

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: `Pedido de auxilio ${helpOrder.id}`,
      template: 'helpOrder',
      context: {
        student: helpOrder.student.name,
        question: helpOrder.question,
        answer: helpOrder.answer,
        answer_at: format(parseISO(helpOrder.answer_at), 'dd/MM/uuuu HH:mm', {
          locale: pt,
        }),
      },
    });
  }
}

export default new HelpOrderMail();
