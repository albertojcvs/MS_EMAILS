import { IMailProvider } from "../providers/IMailProvider";

import { MailTrapProvider } from "../providers/implementations/MailTrapProvider";

import { SendNewBetsEmail } from "../kafka/handlers/SendNewBetsEmail";

let mailProvider: IMailProvider;

const sendEmailMock = jest.fn();
let sendNewBetsEmail: SendNewBetsEmail;

jest.mock("../providers/implementations/MailTrapProvider", () => {
  return {
    MailTrapProvider: jest.fn().mockImplementation(() => {
      return { send: sendEmailMock };
    }),
  };
});
describe("Send Message", () => {
  beforeEach(() => {
    mailProvider = new MailTrapProvider();
    sendNewBetsEmail = new SendNewBetsEmail(mailProvider);
  });

  it("should be able to send a make new bets email to user", async () => {
    await sendNewBetsEmail.handle({
      to: "fake@email.com",
      from: "fake@email.com",
      subject: "Welcome",
      username: "fake",
      bets: [{ numbers: [1, 2, 3, 4, 5, 6], game_name: "Mega" }],
    });

    expect(sendEmailMock).toHaveBeenCalled();
  });
});
