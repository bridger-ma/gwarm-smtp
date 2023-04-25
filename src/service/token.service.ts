import { Token } from "../models/token";
import axios from "axios";
import FormData from "form-data";
export class TokenService {
  tokens: Map<string, Token> = new Map();
  constructor(private readonly storeUri: string) {}

  async fetchToken(email: string): Promise<Token> {
    const response = await axios.get<Token>(
      `${this.storeUri}/api/tokens/${email}`
    );
    return response.data;
  }

  async refreshToken(token: Token): Promise<Token> {
    let data = new FormData();
    data.append("refresh_token", token.refresh_token);
    data.append("grant_type", "refresh_token");
    data.append("client_id", "de8bc8b5-d9f9-48b1-a8ad-b748da725064");
    data.append("scope", token.scope);
    data.append("id_token", token.id_token);
    data.append(
      "redirect_uri",
      "https://developer.microsoft.com/en-us/graph/graph-explorer"
    );

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        Origin: "https://developer.microsoft.com",
        ...data.getHeaders(),
      },
      data: data,
    };

    const response = await axios.request<Token>(config);
    return response.data;
  }

  storeToken(sessionId: string, token: Token) {
    this.tokens.set(sessionId, token);
  }
  getToken(sessionId: string): Token | undefined {
    return this.tokens.get(sessionId);
  }
}
