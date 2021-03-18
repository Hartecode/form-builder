export interface Option {
  id: string;
  value: string;
  label: string;
  selected: boolean;
}

export type FieldType = 'checkbox' | 'text' | 'textarea' | 'tel' | 'email' | 'select' | '';

export interface Field {
  id: string;
  title: string;
  type: FieldType;
  required: boolean;
  placeholder?: string;
  checked?: boolean;
  pattern?: string;
  minLength?: string;
  maxLength?: string;
  options?: Option[];
  subGroups: Group[];
  subGroupsData: GroupDataObj;
  subFields: Group[];
  subFieldsData: FieldDataObj;
}

export interface Group {
  key: string;
  label: string;
}

export interface GroupData {
  id: string;
  label: string;
  fields: Group[];
  fieldsData: FieldDataObj;
  subGroups: Group[];
  subGroupsData: GroupDataObj;
  subFields: Group[];
  subFieldsData: FieldDataObj;
}

export interface FieldDataObj {
  [key: string] : Field;
}

export interface GroupDataObj {
  [key: string] : GroupData
}

export interface Store {
  title: string;
  description: string;
  group: Group[];
  groupData: GroupDataObj;
}