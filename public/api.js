import { apps } from "../private/apps.js";
import { auth } from "./meta.js";
import config from "@proxtx/config";
import { genCombine } from "@proxtx/combine-rest/request.js";
import { genModule } from "@proxtx/combine/combine.js";

export const execute = async (pwd, appName, method, args) => {
  if (!auth(pwd)) return;
  args = await resolveArguments(pwd, args);
  let app = apps[appName];
  if (!app.definitions?.methods[method] && app.updateDefinitions)
    await app.updateDefinitions();
  if (app.definitions?.methods[method]) return await app[method](...args);
};

let inputApi;
export const resolveArguments = async (pwd, args) => {
  if (!auth(pwd)) return;
  if (!inputApi)
    inputApi = await genCombine(config.inputs, "public/api.js", genModule);
  for (let argIndex in args) {
    args[argIndex] = await inputApi.resolveInput(args[argIndex]);
  }

  return args;
};

export const getApps = (pwd) => {
  if (!auth(pwd)) return;
  return config.apps;
};

export const getDefinitions = async (pwd, appName) => {
  if (!auth(pwd)) return;
  let app = apps[appName];
  app.updateDefinitions && (await app.updateDefinitions());
  return app.definitions;
};
