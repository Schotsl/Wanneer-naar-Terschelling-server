import { Context } from "https://deno.land/x/oak@v7.7.0/mod.ts";
import {
  AuthenticationError,
  BodyError,
  PropertyError,
  TypeError,
} from "./errors.ts";

export const bodyValidation = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  if (ctx.request.method === "POST") {
    // Make sure every POST request has a body
    if (!ctx.request.hasBody) throw new BodyError("missing");

    // Make sure every POST body is valid JSON
    const body = ctx.request.body({ type: "json" });
    await body.value.catch(() => {
      throw new BodyError("invalid");
    });
  }

  await next();
  return;
};

export const errorHandler = async (
  ctx: Context,
  next: () => Promise<unknown>,
) => {
  await next().catch(
    (
      error:
        | TypeError
        | PropertyError
        | AuthenticationError,
    ) => {
      // Send error to user
      ctx.response.status = error.statusError;
      ctx.response.body = {
        message: error.message,
      };
    },
  );
};
