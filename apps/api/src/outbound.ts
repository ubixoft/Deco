import { JwtIssuer } from "@deco/sdk/auth";
import { Hosts } from "@deco/sdk/hosts";
import { Context, Hono } from "hono";
import { getRuntimeKey } from "hono/adapter";
import { AppEnv } from "./utils/context.ts";

export const shouldRouteToOutbound = (
  req: Request,
  env?: AppEnv["Bindings"],
) => {
  const originIsScript = typeof env?.DECO_CHAT_APP_ORIGIN === "string";
  const isApiHost = req.headers.get("host") === Hosts.API;
  const isUnauthorized = !req.headers.has("authorization");
  console.log("should route", { originIsScript, isApiHost, isUnauthorized });
  return (
    originIsScript &&
    (!isApiHost || isUnauthorized)
  );
};

async function handleApiHostRequest(
  c: Context<AppEnv>,
  dispatchScript: string,
  jwtSecret: string,
): Promise<Request | null> {
  const { data, error } = await c.var.db
    .from("deco_chat_hosting_apps")
    .select("*")
    .eq("slug", dispatchScript)
    .maybeSingle();

  if (error) {
    console.error("error querying script", error);
    return null;
  }

  if (!data) {
    return null;
  }

  const jwt = JwtIssuer.forSecret(jwtSecret);
  const token = await jwt.create({
    sub: `app:${dispatchScript}`,
    aud: data.workspace,
  });

  const reqHeaders = new Headers(c.req.raw.headers);
  reqHeaders.set("Authorization", `Bearer ${token}`);

  return new Request(c.req.raw.url, {
    method: c.req.raw.method,
    headers: reqHeaders,
    body: c.req.raw.body,
    redirect: c.req.raw.redirect,
  });
}

export const app = new Hono<AppEnv>();

app.all("/*", async (c) => {
  let req = c.req.raw;
  console.log(
    "routing to outbound",
    c.req.header("host"),
    c.env.DECO_CHAT_APP_ORIGIN,
    c.env.ISSUER_JWT_SECRET,
  );
  if (c.req.header("host") === Hosts.API) {
    const dispatchScript = c.env.DECO_CHAT_APP_ORIGIN;
    const jwtSecret = c.env.ISSUER_JWT_SECRET;
    if (dispatchScript && typeof jwtSecret === "string") {
      const authorizedReq = await handleApiHostRequest(
        c,
        dispatchScript,
        jwtSecret,
      );
      if (!authorizedReq) {
        return new Response("could not authorize request", { status: 500 });
      }
      req = authorizedReq;
    }
  }
  const response = await fetch(req);
  if (getRuntimeKey() === "workerd") { // needs to be copied when resp is from an a external dispatcher.
    return new Response(response.body, response);
  }
  return response;
});

export default app;
