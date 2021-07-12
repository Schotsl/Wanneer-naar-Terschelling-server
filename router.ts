import { Router } from "https://deno.land/x/oak@v7.7.0/mod.ts";
import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import { initializeEnv } from "./helper.ts";

import VacationController from "./controller/VacationController.ts";

// Initialize .env variables and make sure they are set
initializeEnv([
  "WANNEER_NAAR_TERSCHELLING_SERVER_MYSQL_HOST",
  "WANNEER_NAAR_TERSCHELLING_SERVER_MYSQL_USER",
  "WANNEER_NAAR_TERSCHELLING_SERVER_MYSQL_PASS",
  "WANNEER_NAAR_TERSCHELLING_SERVER_MYSQL_PORT",
  "WANNEER_NAAR_TERSCHELLING_SERVER_MYSQL_BASE",
]);

// Fetch the variables and convert them to right datatype
const hostname = Deno.env.get("WANNEER_NAAR_TERSCHELLING_SERVER_MYSQL_HOST")!;
const username = Deno.env.get("WANNEER_NAAR_TERSCHELLING_SERVER_MYSQL_USER")!;
const password = Deno.env.get("WANNEER_NAAR_TERSCHELLING_SERVER_MYSQL_PASS")!;
const port = +Deno.env.get("WANNEER_NAAR_TERSCHELLING_SERVER_MYSQL_PORT")!;
const db = Deno.env.get("WANNEER_NAAR_TERSCHELLING_SERVER_MYSQL_BASE")!;

const router = new Router();
const client = new Client();

// Connect to MySQL server
await client.connect({
  hostname,
  username,
  password,
  port,
  db,
});

const vacationController = new VacationController(client);

// Public routes
router.get(
  "/vacation",
  vacationController.getCollection.bind(vacationController),
);

router.post(
  "/vacation",
  vacationController.addObject.bind(vacationController),
);

router.delete(
  "/vacation/:uuid",
  vacationController.removeObject.bind(vacationController),
);

export default router;
