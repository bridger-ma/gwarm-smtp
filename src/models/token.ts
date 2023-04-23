export class Token {
  token_type!: string;
  scope!: string;
  id_token!: string;
  expires_in!: number;
  ext_expires_in!: number;
  access_token!: string;
  refresh_token!: string;
}
