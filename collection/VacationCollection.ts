import BaseCollection from "./BaseCollection.ts";
import VacationEntity from "../entity/VacationEntity.ts";

export default class VacationCollection extends BaseCollection {
  public vacations: Array<VacationEntity> = [];
}
