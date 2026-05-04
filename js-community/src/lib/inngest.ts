/**
 * Inngest client
 *
 * Central Inngest client instance used across all background functions.
 * Set INNGEST_EVENT_KEY and INNGEST_SIGNING_KEY environment variables
 * for production use. In development, the Inngest dev server handles
 * authentication automatically.
 */

import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "js-community",
  name: "JS Community",
});
