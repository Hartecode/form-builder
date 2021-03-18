import { Group, Option, FieldType } from '../interface/store'
import { FormFieldInput, Root, createField, createGroup, GroupNodeObj, convertToNodeObj, FieldNodeObj, removeNode } from './store'
import { FormGroup } from './formGroup'
import { uuID } from './helpers'

export class FieldNode {
  title: string;
  type: FieldType;
  required: boolean;
  placeholder: string;
  checked: boolean;
  pattern: string;
  minLength: string;
  maxLength: string;
  options: Option[];
  private _id: string;
  private _subGroups: Group[];
  private _subGroupsData: GroupNodeObj;
  private _subFields: Group[];
  private _subFieldsData: FieldNodeObj;
  private _parent: Root | FormGroup | FieldNode | null;
  private _position: 'field' =  'field';

  constructor(prop: FormFieldInput) {
    this._id = prop.id || uuID();
    this.title = prop.title || `Field ${this._id}`;
    this.type = prop.type || '';
    this.required = !!(prop.required);
    this.placeholder = prop.placeholder;
    this.checked = prop.checked
    this.pattern = prop.pattern;
    this.minLength = prop.maxLength;
    this.maxLength = prop.maxLength;
    this.options = prop.options || [];
    this._subGroups = prop.subGroups || [];
    this._subGroupsData = convertToNodeObj(prop.subGroupsData, FormGroup, this) as GroupNodeObj;
    this._subFields = prop.subFields || [];
    this._subFieldsData = convertToNodeObj(prop.subFieldsData, FieldNode, this) as FieldNodeObj;
    this._parent = prop.parent || null;
  }

  get id() {
    return this._id;
  }

  get subGroups() {
    return this._subGroups
  }

  get subGroupsData() {
    return this._subGroupsData;
  }

  get subFields() {
    return this._subFields;
  }

  get subFieldsData() {
    return this._subFieldsData;
  }

  get parent() {
    return this._parent;
  }

  get position(): 'field' {
    return this._position;
  }

  getSubGroupData(id: string) {
    return this.subGroupsData[id] || null;
  }

  createNewSubGroup() {
    const [ indObj, groupNode ] = createGroup(this);
    this._subGroups = [...this._subGroups, indObj as Group];
    this._subGroupsData[(groupNode as FormGroup).id] = groupNode as FormGroup;
    return [this._subGroups, this._subGroupsData];
  }

  removeSubGroup(id: string) {
    const [filteredGroup, cleanData] = removeNode(id, this.subGroups, this.subGroupsData);
    this._subGroups = filteredGroup as Group[];
    this._subGroupsData = cleanData as GroupNodeObj;
    return [this._subGroups, this._subGroupsData];
  }

  creatNewSubField() {
    const [ indObj, fieldNode ] = createField(this);
    this._subFields = [...this._subFields, indObj as Group];
    this._subFieldsData[(fieldNode as FieldNode).id] = fieldNode as FieldNode;
    return [this._subFields, this._subFieldsData];
  }

  removeSubField(id: string) {
    const [filteredGroup, cleanData] = removeNode(id, this._subFields, this._subFieldsData);
    this._subFields = filteredGroup as Group[];
    this._subFieldsData = cleanData as FieldNodeObj;
    return [this._subFields, this._subFieldsData];
  }

  addOption() {
    this.options = [...this.options, {
      id: uuID(),
      value: '',
      label: '',
      selected: false
    }];
    return this.options;
  }

  removeOption(id: string) {
    this.options = this.options.filter(v => v.id !== id);
    return this.options;
  }

  updateOption(opt: Option) {
    this.options = this.options.map(v => {
      if (v.id === opt.id) {
        return opt;
      }
      return v;
    })
    return this.options;
  }

}