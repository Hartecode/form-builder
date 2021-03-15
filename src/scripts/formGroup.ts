import { Store, GroupDataObj, GroupData, Group, Field, FieldDataObj } from '../interface/store'
import { Root, GroupNodeObj, FormGroupInput, convertToNodeObj } from './store'
import { uuID } from './helpers'

export class FormGroup {
  private id: string;
  private label: string;
  private fields: Group[];
  private fieldsData: FieldDataObj;
  private subGroups: Group[];
  private subGroupsData: GroupNodeObj;
  private subFields: Group[];
  private subFieldsData: FieldDataObj;
  private parent: Root | FormGroup | null;

  constructor(input: FormGroupInput) {
    this.id = input.id || uuID();
    this.label = input.label || '';
    this.fields = input.fields || [];
    this.fieldsData = input.fieldsData || {};
    this.subGroups = input.subGroups || [];
    this.subGroupsData = convertToNodeObj(input.subGroupsData, FormGroup, this);
    this.subFields = input.subFields || [];
    this.subFieldsData = input.subFieldsData || {};
    this.parent = input.parent || null;
  }

  get gID(): string {
    return this.id;
  }

  get gLabel(): string {
    return this.label;
  }

  get gFields(): Group[] {
    return this.fields;
  };

  get gSubGroups(): Group[] {
    return this.subGroups;
  }

  get gSubFields() {
    return this.subFields;
  }

  get gParent(): Root | FormGroup | null {
    return this.parent;
  }

}