import { Request, Response } from "https://deno.land/x/oak@v7.7.0/mod.ts";
import { AuthenticationError, PropertyError, TypeError } from "../errors.ts";
import { isDate, isLength } from "../helper.ts";
import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";
import VacationEntity from "../entity/VacationEntity.ts";
import VacationRepository from "../repository/VacationRepository.ts";

export default class VacationController {
  private vacationRepository: VacationRepository;

  constructor(client: Client) {
    this.vacationRepository = new VacationRepository(client);
  }

  async addObject(
    { request, response }: { request: Request; response: Response },
  ) {
    // Fetch the client IP and validate it
    if (request.ip !== `80.61.199.248`) {
      throw new AuthenticationError("origin");
    }

    // Fetch the body parameters
    const body = await request.body();
    const value = await body.value;

    // Make sure the required properties are provided
    if (typeof value.end === "undefined") {
      throw new PropertyError("missing", "end");
    }
    if (typeof value.start === "undefined") {
      throw new PropertyError("missing", "start");
    }
    if (typeof value.title === "undefined") {
      throw new PropertyError("missing", "title");
    }
    if (typeof value.holst === "undefined") {
      throw new PropertyError("missing", "holst");
    }
    if (typeof value.other === "undefined") {
      throw new PropertyError("missing", "other");
    }
    if (typeof value.hartman === "undefined") {
      throw new PropertyError("missing", "hartman");
    }
    if (typeof value.steenmeijer === "undefined") {
      throw new PropertyError("missing", "steenmeijer");
    }

    // Make sure the required properties are the right type
    if (typeof value.end !== "string") throw new TypeError("string", "end");
    if (typeof value.start !== "string") throw new TypeError("string", "start");
    if (typeof value.title !== "string") throw new TypeError("string", "title");
    if (typeof value.holst !== "boolean") {
      throw new TypeError("boolean", "holst");
    }
    if (typeof value.other !== "boolean") {
      throw new TypeError("boolean", "other");
    }
    if (typeof value.hartman !== "boolean") {
      throw new TypeError("boolean", "hartman");
    }
    if (typeof value.steenmeijer !== "boolean") {
      throw new TypeError("boolean", "steenmeijer");
    }

    // Make sure the properties are valid
    if (!isDate(value.end)) throw new PropertyError("length", "end");
    if (!isDate(value.start)) throw new PropertyError("length", "start");
    if (!isLength(value.title)) throw new PropertyError("length", "title");

    // Create the VacationEntity object
    const vacation = new VacationEntity();

    vacation.end = value.end;
    vacation.start = value.start;
    vacation.title = value.title;
    vacation.holst = value.holst;
    vacation.other = value.other;
    vacation.hartman = value.hartman;
    vacation.steenmeijer = value.steenmeijer;

    // Insert into the database and return the result
    response.body = await this.vacationRepository.addObject(vacation);
    response.status = 200;
  }

  async getCollection(
    { request, response }: { request: Request; response: Response },
  ) {
    // Fetch variables from URL GET parameters
    let limit = request.url.searchParams.get(`limit`)
      ? request.url.searchParams.get(`limit`)
      : 5;

    let offset = request.url.searchParams.get(`offset`)
      ? request.url.searchParams.get(`offset`)
      : 0;

    // Validate limit and offset are numbers
    if (isNaN(+limit!)) throw new TypeError("number", "limit");
    if (isNaN(+offset!)) throw new TypeError("number", "offset");

    // Transform the strings into numbers
    limit = Number(limit);
    offset = Number(offset);

    // Return results to the user
    response.status = 200;
    response.body = await this.vacationRepository.getCollection(offset, limit);
  }

  async removeObject(
    { request, params, response }: {
      request: Request;
      params: { uuid: string };
      response: Response;
    },
  ) {
    // Fetch the client IP and validate it
    if (request.ip !== `80.61.199.248`) {
      throw new AuthenticationError("origin");
    }

    // Remove the vacation using the UUID from the URL
    const result = await this.vacationRepository.removeObject(params.uuid);

    response.status = result ? 204 : 404;
  }
}
