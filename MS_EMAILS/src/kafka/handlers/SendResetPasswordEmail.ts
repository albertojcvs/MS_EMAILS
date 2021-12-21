import { IMailProvider, IMessage } from "../../providers/IMailProvider";
import { KafkaHandle } from "./KafkaHandle";

interface ISendResetPasswordEmailMessageProps extends Omit<IMessage, "body"> {
  username: string;
  link: string;
}

export class SendResetPasswordEmail extends KafkaHandle {
  constructor(mailProvider: IMailProvider) {
    super(mailProvider);
  }

  async handle({
    to,
    from,
    subject,
    username,
    link,
  }: ISendResetPasswordEmailMessageProps) {
    await this.mailProvider.send({
      from,
      to,
      subject,
      body: `
      <h1>Hey, ${username}</h1>


    <p> You have solicited the reset of your password</p>
    
    <p>Create a new password with the link below</p>
    
    <a href=${link}>Create new password</a>
    `,
    });
  }
}
