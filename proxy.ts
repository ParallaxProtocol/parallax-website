import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for:
  // - api routes
  // - _next internals
  // - static assets with a file extension
  // - the .well-known folder (nostr.json etc.)
  matcher: ["/((?!api|_next|.well-known|.*\\..*).*)"],
};
