import { genCombine } from "@proxtx/combine-rest/request.js";
import { genModule } from "@proxtx/combine/combine.js";
import config from "@proxtx/config";

export const clients = {};

const api = await genCombine(config.unify, "public/api.js", genModule);

const genClients = async () => {
  let clientNames = await api.getClients(config.pwd);

  for (let client of clientNames) {
    clients[client] = new Client(client);
  }
};

let rfs = false;

export const refreshClients = async () => {
  try {
    if (rfs) {
      await rfs;
      if (rfs) await rfs;
      return;
    }
    clearClients();
    rfs = api.refreshClients(config.pwd);
    await rfs;
    rfs = genClients();
    await rfs;
  } catch {
    rfs = false;
  }
};

class Client {
  constructor(id) {
    this.client = id;
  }

  async request(service, data, args) {
    return await api.request(config.pwd, this.client, service, data, args);
  }
}

const clearClients = () => {
  for (let clientName in clients) delete clients[clientName];
};

await genClients();
