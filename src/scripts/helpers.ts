import { FieldNodeObj, GroupNodeObj } from "./store";
import { GroupDataObj, FieldDataObj } from "../interface/store"

export const uuID = (): string => Math.random().toString(36).substr(2, 9);

export const getGroupDataObj = (obj: GroupNodeObj): GroupDataObj => Object.keys(obj)
  .reduce((acc, cur) => {
    acc[cur] = obj[cur].getGroupData()
    return acc
  }, {})

export const getFieldDataObj = (obj: FieldNodeObj): FieldDataObj => Object.keys(obj)
  .reduce((acc, cur) => {
    acc[cur] = obj[cur].getFieldData()
    return acc
  }, {})