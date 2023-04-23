import { Message, MessageForSend } from "../models/message";
import { simpleParser } from "mailparser";
import axios from "axios";
import { Token } from "../models/token";
export class MessageService {
  async constructMessage(data: string): Promise<MessageForSend> {
    const origin = await simpleParser(data);
    if (!origin.to) throw new Error("No recipient");
    const to = Array.isArray(origin.to) ? origin.to[0].value : origin.to.value;
    const emailAddress = to[0].address;
    if (!emailAddress) throw new Error("No recipient");

    return {
      message: {
        subject: origin.subject ?? "",
        body: {
          contentType: "HTML",
          content: (origin.html as string) ?? origin.textAsHtml ?? "",
        },
        toRecipients: [
          {
            emailAddress: {
              address: emailAddress,
              name: "",
            },
          },
        ],
      },
    };
  }
  async sendMessage(token: Token, message: MessageForSend): Promise<void> {
    await axios.post<Message>(
      "https://graph.microsoft.com/v1.0/me/sendMail",
      message,
      {
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
        },
      }
    );
  }
}
