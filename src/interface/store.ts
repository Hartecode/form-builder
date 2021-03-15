export interface Option {
  value: string;
  content: string;
  selected: boolean;
}

export interface Field {
  title: string;
  type: 'checkbox' | 'text' | 'textarea' | 'tel' | 'email' | 'select';
  required: boolean;
  placeholder?: string;
  checked?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
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