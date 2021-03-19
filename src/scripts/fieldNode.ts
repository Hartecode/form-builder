import { Group, Option, FieldType, Field } from '../interface/store'
import { FormFieldInput, createField, createGroup, GroupNodeObj, convertToNodeObj, FieldNodeObj, removeNode } from './store'
import { FormGroup } from './formGroup'
import { uuID, getGroupDataObj, getFieldDataObj } from './helpers'

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
  private _parent: FormGroup | FieldNode | null;
  private _position: 'field' =  'field';
  private _fieldType: 'field' | 'subField';

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
    this._fieldType = prop.fieldType;
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

  get fieldType() : 'field' | 'subField' {
    return this._fieldType;
  }

  getFieldData(): Field {
    return {
      id: this._id,
      title: this.title,
      type: this.type,
      required: this.required,
      placeholder: this.placeholder,
      checked: this.checked,
      pattern: this.pattern,
      minLength: this.minLength,
      maxLength: this.maxLength,
      options: this.options,
      subGroups: this._subGroups,
      subGroupsData: getGroupDataObj(this._subGroupsData),
      subFields: this._subFields,
      subFieldsData: getFieldDataObj(this._subFieldsData)
    }
  }

  getSubGroupData(id: string) {
    return this._subGroupsData[id] || null;
  }

  getSubFieldData(id: string) {
    return this._subFieldsData[id] || null;
  }

  createNewSubGroup() {
    const [ indObj, groupNode ] = createGroup(this, 'subGroup');
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
    const [ indObj, fieldNode ] = createField(this, 'subField');
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

  updateSubFieldOrder(list: Group[]) {
    this._subFields = list;
    list.forEach(item => {
      if (!(item.key in this._subFieldsData)) {
        this._subFieldsData[item.key] = new FieldNode({ 
          id: item.key,
          title:  `Field ${item.key}`,
          parent: this,
          fieldType: 'subField' })
      }
    })
    return [this._subFields, this._subFieldsData];
  }

  updateSubGroupOrder(list: Group[]) {
    this._subGroups = list;
    list.forEach(item => {
      if (!(item.key in this._subGroupsData)) {
        this._subGroupsData[item.key] = new FormGroup({ 
          id: item.key,
          label:  `Group ${item.key}`,
          parent: this,
          groupType: 'subGroup' })
      }
    })
    return [this.subGroups, this._subGroupsData];
  }

  updateSubGroupItem(item: Group) {
    this._subGroups = this.subGroups.map(obj => {
      return obj.key === item.key ? item : obj
    })
    return this._subGroups;
  }

  updateSubFieldItem(item: Group) {
    this._subFields = this._subFields.map(obj => {
      return obj.key === item.key ? item : obj
    })
    return this._subFields;
  }

}