export default {
  fetch(request: Request, env: { DECO_CHAT_API: Service }) {
    const host = request.headers.get("host") ?? new URL(request.url).host;
    if (host === "api.deco.chat") {
      return env.DECO_CHAT_API.fetch(request);
    }
    return fetch(request);
  },
};
