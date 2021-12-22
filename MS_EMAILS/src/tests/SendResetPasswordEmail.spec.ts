import { IMailProvider } from "../providers/IMailProvider";

import { MailTrapProvider } from "../providers/implementations/MailTrapProvider";

import { SendResetPasswordEmail } from "../kafka/handlers/SendResetPasswordEmail";

let mailProvider: IMailProvider;

const sendEmailMock = jest.fn();
let sendResetPasswordEmail: SendResetPasswordEmail;

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
    sendResetPasswordEmail = new SendResetPasswordEmail(mailProvider);
  });

  it("should be able to send a reset password email to user", async () => {
    await sendResetPasswordEmail.handle({
      to: "fake@email.com",
      from: "fake@email.com",
      subject: "Welcome",
      username: "fake",
      link: "www.linkfalso.com",
    });

    expect(sendEmailMock).toHaveBeenCalled();
  });
});
