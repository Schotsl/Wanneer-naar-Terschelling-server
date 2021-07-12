import BaseEntity from "./BaseEntity.ts";

export default class VacationEntity extends BaseEntity {
  public end = new Date();
  public start = new Date();

  public title = ``;

  public holst = false;
  public other = false;
  public hartman = false;
  public steenmeijer = false;
}
