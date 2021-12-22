import { IMailProvider, IMessage } from "../../providers/IMailProvider";
import { KafkaHandle } from "./KafkaHandle";

interface IBetsProps {
  game_name: string;
  numbers: number[];
}

interface ISendNewBetsEmailToAdmsMessageProps extends Omit<IMessage, "body"> {
  adminUsername: string;
  playerUsername: string;
  bets: IBetsProps[];
}

export class SendNewbetsToAdmsEmail extends KafkaHandle {
  constructor(mailProvider: IMailProvider) {
    super(mailProvider);
  }
  async handle({
    to,
    from,
    subject,
    bets,
    adminUsername,
    playerUsername,
  }: ISendNewBetsEmailToAdmsMessageProps) {
    const betsInString = bets.reduce(
      (string, bet) => string  + `<li>${bet.game_name}: ${bet.numbers}</li>`,
      ""
    );
    this.mailProvider.send({
      to,
      from,
      subject,
      body: `Hey, ${adminUsername}

    <p>${playerUsername} made new ${bets.length == 1 ? "bet" : "bets"}:</p>
    <ul>
        ${betsInString}
    </ul>
    `,
    });
  }
}
