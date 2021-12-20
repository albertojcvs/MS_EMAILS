import { IMailProvider, IMessage } from "../../providers/IMailProvider";
import { KafkaHandle } from "./KafkaHandle";

interface BetsProps {
  game_name: string;
  numbers: number[];
}

interface ISendNewBetsEmailMessageProps extends Omit<IMessage, "body"> {
  username: string;
  bets: BetsProps[];
}

export class SendNewBetsEmail extends KafkaHandle {
  constructor(mailProvider: IMailProvider) {
    super(mailProvider);
  }

  async handle({ to, from, username, bets,subject }: ISendNewBetsEmailMessageProps) {
    const betsInString = bets.reduce((string, bet) => {
      return string + `<li>${bet.game_name}: ${bet.numbers}</li>`;
    }, "");

    await this.mailProvider.send({
      from,
      to,
      subject,
      body: `
        <h1>Hey, ${username}</h1>
        <p>You made new bets</p>
        <ul>
        ${betsInString}
        </ul>
      `,
    });
  }
}
