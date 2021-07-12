// deno-lint-ignore-file no-explicit-any

import { cleanHex } from "../helper.ts";

import VacationEntity from "../entity/VacationEntity.ts";
import InterfaceMapper from "./InterfaceMapper.ts";
import VacationCollection from "../collection/VacationCollection.ts";

export default class VacationMapper implements InterfaceMapper {
  public mapObject(row: any): VacationEntity {
    const vacation = new VacationEntity();

    // Re-add the dashes to the UUID and lowercase the string
    vacation.uuid = cleanHex(row.uuid);

    // Transform the MySQL date string into a JavaScript Date object
    vacation.end = new Date(row.end);
    vacation.start = new Date(row.start);
    vacation.created = new Date(row.created);
    vacation.updated = new Date(row.updated);

    // Transform the numbers into booleans
    vacation.holst = row.holst === 1;
    vacation.other = row.other === 1;
    vacation.hartman = row.hartman === 1;
    vacation.steenmeijer = row.steenmeijer === 1;

    vacation.title = row.title;

    return vacation;
  }

  public mapArray(
    rows: Array<any>,
  ): Array<VacationEntity> {
    const vacations = rows.map((row) => this.mapObject(row));

    return vacations;
  }

  public mapCollection(
    rows: Array<any>,
    offset: number,
    limit: number,
    total: number,
  ): VacationCollection {
    const vacations = this.mapArray(rows);

    return {
      total,
      limit,
      offset,
      vacations,
    };
  }
}
