import { Message, MessageForSend, MessagesPage } from "../models/message";
import { simpleParser } from "mailparser";
import axios from "axios";
import { v4 } from "uuid";
import { Token } from "../models/token";
import { Proxy } from "../models/proxy";
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
  async sendMessage(
    token: Token,
    message: MessageForSend,
    proxy?: Proxy
  ): Promise<void> {
    console.log(proxy);
    await axios.post<Message>(
      "https://graph.microsoft.com/v1.0/me/sendMail",
      message,
      {
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
          "Content-type": "application/json",
          Host: "graph.microsoft.com",
          "Accept-Encoding": "gzip, deflate, br",
          SdkVersion: "GraphExplorer/4.0, graph-js/3.0.5 (featureUsage=6)",
          "Accept-Language": "en-US,en;q=0.9",
          Referer: "https://developer.microsoft.com/",
          "client-request-id": v4(),
          "sec-ch-ua-platform": '"Windows"',
          Accept: "*/*",
          Origin: "https://developer.microsoft.com",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36 Edg/112.0.1722.34",
        },
        // http:185.2.81.74:21921:30cd5f04-1252338:7su03rmn7bl
        proxy: proxy ? proxy.config : undefined,
      }
    );
  }

  async markMessageAsRead(token: Token, messageId: string): Promise<void> {
    const response = await axios.patch(
      `https://graph.microsoft.com/v1.0/me/messages/${messageId}`,
      {
        isRead: true,
      },
      {
        headers: {
          Authorization: `${token.token_type} ${token.access_token}`,
        },
      }
    );
  }
  async fetchMessagePage(
    token: Token,
    nextLink: string
  ): Promise<MessagesPage> {
    let response = await axios.get<MessagesPage>(nextLink, {
      headers: {
        Authorization: `${token.token_type} ${token.access_token}`,
      },
    });
    return response.data;
  }
}
