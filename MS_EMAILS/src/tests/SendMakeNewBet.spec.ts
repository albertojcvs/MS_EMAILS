import { IMailProvider } from "../providers/IMailProvider";

import { MailTrapProvider } from "../providers/implementations/MailTrapProvider";

import { SendMakeNewBetsEmails } from "../kafka/handlers/SendMakeNewBetsEmail";

let mailProvider: IMailProvider;

const sendEmailMock = jest.fn();
let sendMakeNewBetsEmail: SendMakeNewBetsEmails;

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
    sendMakeNewBetsEmail = new SendMakeNewBetsEmails(mailProvider);
  });

  it("should be able to send a make new bets email to user", async () => {
    await sendMakeNewBetsEmail.handle({
      to: "fake@email.com",
      from: "fake@email.com",
      subject: "Welcome",
      username: "fake",
      link: "www.linkfalso.com",
    });

    expect(sendEmailMock).toHaveBeenCalled();
  });
});
