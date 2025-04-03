import { SDK } from "https://webdraw.com/webdraw-sdk@v1";
// Uncomment for testing
// import { SDK } from "http://localhost:5173/webdraw-sdk@v1";

import type { ISDK } from "./types.ts";

const s: ISDK = SDK;

export { s as SDK };
