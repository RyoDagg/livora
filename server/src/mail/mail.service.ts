import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailtrapClient } from 'mailtrap';

@Injectable()
export class MailService {
  async sendMail({
    to,
    subject,
    body,
    fromEmail = 'no-reply@livora.tn',
    fromName = 'Livora Team',
  }: {
    to: string[];
    subject: string;
    body: string;
    fromEmail?: string;
    fromName?: string;
  }) {
    if (!process.env.MAILTRAP_TOKEN) {
      throw new InternalServerErrorException({
        code: 'MAIL_CONFIGURATION_ERROR',
        message: 'Mail service is not configured',
      });
    }

    const client = new MailtrapClient({
      token: process.env.MAILTRAP_TOKEN!,
    });

    try {
      await client.send({
        from: {
          email: fromEmail,
          name: fromName,
        },
        to: to.map((email) => ({ email })),
        subject,
        text: body,
      });
    } catch (error) {
      console.error(`Failed to send email to ${to}:`, error);
      throw new InternalServerErrorException({
        code: 'MAIL_SEND_FAILED',
        message: 'Failed to send email',
      });
    }
  }
}
