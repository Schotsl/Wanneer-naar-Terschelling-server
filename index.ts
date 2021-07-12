import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { Application } from "https://deno.land/x/oak@v7.7.0/mod.ts";
import { bodyValidation, errorHandler } from "./middleware.ts";

// import router from "./router.ts";

const application = new Application();

application.use(errorHandler);
application.use(bodyValidation);

application.use(oakCors());
// application.use(router.routes());
// application.use(router.allowedMethods());

// application.listen({ port: 8080 });

addEventListener("fetch", application.fetchEventHandler());
