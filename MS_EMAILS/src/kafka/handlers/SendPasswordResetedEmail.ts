import { IMailProvider, IMessage } from "../../providers/IMailProvider";
import { KafkaHandle } from "./KafkaHandle";

interface ISendPasswordResetedEmailMessageProps extends Omit<IMessage, "body"> {
  username: string;
}

export class SendPasswordResetedEmai extends KafkaHandle {
  constructor(mailProvider: IMailProvider) {
    super(mailProvider);
  }

  async handle({
    to,
    from,
    subject,
    username,
  }: ISendPasswordResetedEmailMessageProps) {
    await this.mailProvider.send({
      from,
      to,
      subject,
      body: `
      <h1>Hey, ${username}</h1>


    <p> Your password was reseted!</p>
    `,
    });
  }
}
