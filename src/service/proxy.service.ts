import { Proxy, ProxyStatusEnum } from "../models/proxy";
import { readFileSync } from "fs";
export class ProxyService {
  proxies: Proxy[] = [];

  loadProxies(file_path: string) {
    const proxies = readFileSync(file_path, "utf8")
      .trim()
      .split("\n")
      .map((line) => {
        const [protocol, host, port, username, password] = line
          .trim()
          .split(":")
          .map((s) => s.trim());
        const proxy: Proxy = {
          id: line,
          config: {
            protocol,
            host,
            port: parseInt(port),
            auth: {
              username,
              password,
            },
          },
          lastUsed: new Date(),
          status: ProxyStatusEnum.UNUSED,
        };
        return proxy;
      });
    this.proxies.push(...proxies);
    return proxies;
  }
  addProxy(proxy: Proxy) {
    this.proxies.push(proxy);
  }

  allocateProxy(email: string): Proxy {
    const allocatedProxy = this.proxies.find((p) => p.allocatedTo === email);
    if (allocatedProxy) return allocatedProxy;
    const proxy = this.proxies.find((p) => p.status === "UNUSED");
    if (proxy) {
      proxy.status = ProxyStatusEnum.USED;
      proxy.allocatedTo = email;
      console.log("allocated proxy", proxy.config.host);
      return proxy;
    }
    throw new Error("No proxy available");
  }

  freeProxy(email: string) {
    const proxy = this.proxies.find((p) => p.allocatedTo === email);
    if (proxy) {
      proxy.status = ProxyStatusEnum.UNUSED;
      proxy.allocatedTo = undefined;
      console.log("free proxy", proxy.config.host);
    }
  }

  getProxyByEmail(email: string): Proxy {
    const proxy = this.proxies.find((p) => p.allocatedTo === email);
    if (proxy) {
      return proxy;
    }
    throw new Error("No proxy allocated to this session");
  }
}
