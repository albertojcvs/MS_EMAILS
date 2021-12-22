import { IMailProvider } from "../providers/IMailProvider";

import { MailTrapProvider } from "../providers/implementations/MailTrapProvider";

import {
  SendWelcomeEmail,
} from "../kafka/handlers/SendWelcomeEmail";

let mailProvider: IMailProvider;

const sendEmailMock = jest.fn();
let sendWelcomeEmail: SendWelcomeEmail;

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
    sendWelcomeEmail = new SendWelcomeEmail(mailProvider);
  });

  test("should be able to send a welcome email to user", async () => {
    await sendWelcomeEmail.handle({
      to: "fake@email.com",
      from: "fake@email.com",
      subject:'Welcome',
      username:'fake'
    });

    expect(sendEmailMock).toHaveBeenCalled()
  });
});
