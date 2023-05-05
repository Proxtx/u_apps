import { genCombine } from "@proxtx/combine-rest/request.js";
import { genModule } from "@proxtx/combine/combine.js";
import config from "@proxtx/config";

const meta = await genCombine(config.unify, "public/meta.js", genModule);

export const auth = async (pwd) => {
  return await meta.auth(pwd);
};
