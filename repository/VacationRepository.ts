import { Client } from "https://deno.land/x/mysql@v2.9.0/mod.ts";

import VacationEntity from "../entity/VacationEntity.ts";
import VacationMapper from "../mapper/VacationMapper.ts";
import VacationCollection from "../collection/VacationCollection.ts";
import InterfaceRepository from "./InterfaceRepository.ts";

export default class VacationRepository implements InterfaceRepository {
  private vacationMapper: VacationMapper;
  private client: Client;

  constructor(client: Client) {
    this.client = client;

    this.vacationMapper = new VacationMapper();
  }

  public async getCollection(
    offset: number,
    limit: number,
  ): Promise<VacationCollection> {
    // Get vacations from the database with the given offset and limit
    const rowsResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, title, \`end\`, \`start\`, holst, other, hartman, steenmeijer, created, updated FROM vacations LIMIT ? OFFSET ?`,
      [limit, offset],
    );

    // Count the total amount of vacations stored in the database
    const totalResult = await this.client.execute(
      `SELECT COUNT(uuid) AS total from vacations`,
    );

    // Map the database rows into a proper array of Vacations
    const rows = rowsResult.rows!;
    const total = totalResult.rows![0].total;

    return this.vacationMapper.mapCollection(rows, offset, limit, total);
  }

  public async getObject(uuid: string): Promise<VacationEntity | null> {
    // Get the vacation from the database by its UUID
    const rowResult = await this.client.execute(
      `SELECT HEX(uuid) AS uuid, title, \`end\`, \`start\`, holst, other, hartman, steenmeijer, created, updated FROM vacations WHERE uuid = UNHEX(REPLACE('${uuid}', '-', ''))`,
    );

    // If no row is found return null
    if (typeof rowResult.rows === "undefined" || rowResult.rows.length === 0) {
      return null;
    }

    // Map the database row into a single Vacation object
    const row = rowResult.rows![0];
    return this.vacationMapper.mapObject(row);
  }

  public async addObject(object: VacationEntity): Promise<VacationEntity> {
    const end = object.end.toISOString().slice(0, 19).replace("T", " ");
    const start = object.start.toISOString().slice(0, 19).replace("T", " ");

    // Insert the vacation into the database
    await this.client.execute(
      `INSERT INTO vacations (uuid, title, \`end\`, \`start\`, holst, other, hartman, steenmeijer) VALUES(UNHEX(REPLACE('${object.uuid}', '-', '')), '${object.title}', '${end}', '${start}', ${object.holst}, ${object.other}, ${object.hartman}, ${object.steenmeijer})`,
    );

    // Fetch the object from the database to get the TIMESTAMPs
    const result = await this.getObject(object.uuid);
    return result!;
  }

  public async removeObject(uuid: string): Promise<boolean> {
    // Delete the vacation from the database by its UUID
    const deleteResult = await this.client.execute(
      `DELETE FROM vacations WHERE uuid = UNHEX(REPLACE('${uuid}', '-', ''))`,
    );

    // Simplify the result to a boolean
    return deleteResult.affectedRows === 0 ? false : true;
  }
}
