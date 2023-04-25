export class ProxyConfig {
  protocol!: string;
  host!: string;
  port!: number;
  auth?: AuthConfig | undefined;
}
export class AuthConfig {
  username!: string;
  password!: string;
}
export enum ProxyStatusEnum {
  USED = "USED",
  UNUSED = "UNUSED",
  ERROR = "ERROR",
}

export class Proxy {
  id!: string;
  config!: ProxyConfig;
  status!: ProxyStatusEnum;
  lastUsed!: Date;
  allocatedTo?: string | undefined;
}
