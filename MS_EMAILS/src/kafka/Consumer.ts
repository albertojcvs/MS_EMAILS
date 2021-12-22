import { Kafka, Consumer as KafkaConsumer } from "kafkajs";
import mail from "../configs/mail";
import { MailTrapProvider } from "../providers/implementations/MailTrapProvider";
import { SendMakeNewBetsEmails } from "./handlers/SendMakeNewBetsEmail";
import { SendNewBetsEmail } from "./handlers/SendNewBetsEmail";
import { SendNewbetsToAdmsEmail } from "./handlers/SendNewBetsToAdmsEmail";
import { SendPasswordResetedEmai } from "./handlers/SendPasswordResetedEmail";
import { SendResetPasswordEmail } from "./handlers/SendResetPasswordEmail";
import { SendWelcomeEmail } from "./handlers/SendWelcomeEmail";

interface IConsumerProps {
  groupId: string;
}

const mailTrapProvider = new MailTrapProvider();
export class Consumer {
  private consumer: KafkaConsumer;

  constructor({ groupId }: IConsumerProps) {
    const kafka = new Kafka({ brokers: ["prova_microservicos_kafka_1:29092"] });
    this.consumer = kafka.consumer({ groupId });
  }

  public async consume() {
    await this.consumer.connect();

    const topics = [
      "send-email-new-bets",
      "send-email-new-user",
      "send-email-make-new-bet",
      "send-email-reset-password",
      "send-email-password-reseted",
      "send-email-new-bets-to-adms",
    ];

    await Promise.all(
      topics.map((topic) => {
        console.log(topic);

        return this.consumer.subscribe({ topic });
      })
    );

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        const data = JSON.parse(message.value?.toString() || "");

        switch (topic) {
          case "send-email-new-user":
            const sendWelcomeEmail = new SendWelcomeEmail(mailTrapProvider);
            await sendWelcomeEmail.handle(data);
            break;
          case "send-email-new-bets":
            const sendNewBetsEmail = new SendNewBetsEmail(mailTrapProvider);
            await sendNewBetsEmail.handle(data);
            break;
          case "send-email-make-new-bet":
            const sendMakeBetEmail = new SendMakeNewBetsEmails(
              mailTrapProvider
            );
            await sendMakeBetEmail.handle(data);
            break;
          case "send-email-reset-password":
            const sendResetPaswordEmail = new SendResetPasswordEmail(
              mailTrapProvider
            );
            await sendResetPaswordEmail.handle(data);
            break;
          case "send-email-password-reseted":
            const sendPasswordResetedEmail = new SendPasswordResetedEmai(
              mailTrapProvider
            );
            await sendPasswordResetedEmail.handle(data);
            break;
          case "send-email-new-bets-to-adms":
            const sendNewbetsToAdmsEmail = new SendNewbetsToAdmsEmail(
              mailTrapProvider
            );
            await sendNewbetsToAdmsEmail.handle(data);
            break;
          default:
            console.log("ERROR");
        }
      },
    });
  }
}
