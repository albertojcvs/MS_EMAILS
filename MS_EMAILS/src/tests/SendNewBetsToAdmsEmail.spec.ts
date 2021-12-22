import { IMailProvider } from "../providers/IMailProvider";

import { MailTrapProvider } from "../providers/implementations/MailTrapProvider";

import { SendNewbetsToAdmsEmail } from "../kafka/handlers/SendNewBetsToAdmsEmail";

let mailProvider: IMailProvider;

const sendEmailMock = jest.fn();
let sendNewToAdmsEmail: SendNewbetsToAdmsEmail;

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
    sendNewToAdmsEmail = new SendNewbetsToAdmsEmail(mailProvider);
  });

  it("should be able to send a make new bets email to user", async () => {
    await sendNewToAdmsEmail.handle({
      to: "fake@email.com",
      from: "fake@email.com",
      subject: "Welcome",
      playerUsername: "playerFake",
      adminUsername:"adminFake",
      bets:[]
    });

    expect(sendEmailMock).toHaveBeenCalled();
  });
});
