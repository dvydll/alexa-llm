import { HttpBindings } from "@hono/node-server";
import { RequestIdVariables } from "hono/request-id";
import { Logger } from "pino";

type Variables = RequestIdVariables & {
	logger: Logger;
};
type Bindings = HttpBindings & {
	/* ... */
};
export type App = {
	Bindings: Bindings;
	Variables: Variables;
};