import { SMTPServer } from "smtp-server";
import { config } from "dotenv";
import { TokenService } from "./service/token.service";
import { MessageService } from "./service/message.service";
config();
const STORE_URI = process.env.STORE_URI;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 25;
const tokenService = new TokenService(process.env.STORE_URI!);
const messageService = new MessageService();
const server = new SMTPServer({
  authOptional: true,
  secure: false,
  authMethods: ["PLAIN", "LOGIN"],
  allowInsecureAuth: true,
  onAuth: async (auth, session, callback) => {
    console.log("new authentication", auth);
    if (!auth.username) {
      callback(new Error("You must provide a username"));
      return;
    }
    try {
      let token = await tokenService.fetchToken(auth.username);
      token = await tokenService.refreshToken(token);
      tokenService.storeToken(session.id, token);
      callback(null, { user: auth.username });
    } catch (e: any) {
      console.log(e);
      callback(new Error(e.message));
    }
  },
  onData(stream, session, callback) {
    // print the message source
    const token = tokenService.tokens.get(session.id);
    if (!token) {
      callback(new Error("No token found"));
      return;
    }
    let message = "";
    stream.on("data", (chunk) => {
      message += chunk.toString("utf8");
    });

    stream.on("end", async () => {
      try {
        const messageForSend = await messageService.constructMessage(message);
        await messageService.sendMessage(token, messageForSend);
        callback();
      } catch (e: any) {
        callback(new Error(e.message));
      }
    });
  },
  //   onRcptTo(address, session, callback) {
  //     // accept all emails
  //     console.log("onRcptTo", address);
  //     callback();
  //   },
});
server.listen(PORT, "127.0.0.1", () => {
  console.log("Server started");
});
