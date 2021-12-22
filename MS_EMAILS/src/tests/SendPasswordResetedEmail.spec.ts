import { IMailProvider } from "../providers/IMailProvider";

import { MailTrapProvider } from "../providers/implementations/MailTrapProvider";

import { SendPasswordResetedEmai } from "../kafka/handlers/SendPasswordResetedEmail";

let mailProvider: IMailProvider;

const sendEmailMock = jest.fn();
let sendPasswordResetedEmail: SendPasswordResetedEmai;

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
    sendPasswordResetedEmail = new SendPasswordResetedEmai(mailProvider);
  });

  it("should be able to send a make new bets email to user", async () => {
    await sendPasswordResetedEmail.handle({
      to: "fake@email.com",
      from: "fake@email.com",
      subject: "Welcome",
      username: "fake",
    });

    expect(sendEmailMock).toHaveBeenCalled();
  });
});
