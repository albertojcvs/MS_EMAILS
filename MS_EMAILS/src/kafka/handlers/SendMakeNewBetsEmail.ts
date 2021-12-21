import { IMailProvider, IMessage } from "../../providers/IMailProvider";
import { KafkaHandle } from "./KafkaHandle";

interface ISendMakeNewBetsEmailMessageProps extends Omit<IMessage, "body"> {
  username: string;
  link: string;
}

export class SendMakeNewBetsEmails extends KafkaHandle {
  constructor(mailProvider: IMailProvider) {
    super(mailProvider);
  }

  async handle({
    username,
    to,
    from,
    subject,
    link,
  }: ISendMakeNewBetsEmailMessageProps) {
    await this.mailProvider.send({
      to,
      from,
      subject,
      body: `
    <h1>Hey, ${username}</h1>
    <p>Do you want to be rich?</p>
    <p>I hope your anwser is yes, so let's make a new bet</p>
    <a href=${link} target="">Cick here to make a new bet</a>    
  `,
    });
  }
}
