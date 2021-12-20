import { IMailProvider, IMessage } from "../../providers/IMailProvider";
import { KafkaHandle } from "./KafkaHandle";

interface ISendWelcomeEmailMessageProps extends Omit<IMessage, "body"> {
  username: string;
}

export class SendWelcomeEmail extends KafkaHandle {
  constructor(mailProvider: IMailProvider) {
    super(mailProvider);
  }

  async handle(message: ISendWelcomeEmailMessageProps) {
    this.mailProvider.send({
      ...message,
      body: `<h1>Hey, ${message.username}</h1>
        <p>Welcome, to our sytem!</p>`,
    });
  }
}
