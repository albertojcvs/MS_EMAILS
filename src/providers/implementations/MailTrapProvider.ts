import Mail from "nodemailer/lib/mailer";
import nodemailer from "nodemailer";
import { IMailProvider, IMessage } from "../IMailProvider";
import mailConfigs from "../../configs/mail";

export class MailTrapProvider implements IMailProvider {
  private transpoter: Mail;
  constructor() {
    this.transpoter = nodemailer.createTransport(mailConfigs);
  }
  async send(message: IMessage) {
    await this.transpoter.sendMail({
      from: message.from,
      to: message.to,
      subject: message.subject,
      html: message.body,
    });
  }
}
