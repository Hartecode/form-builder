import { Group } from '../interface/store'
import { 
  Root, 
  GroupNodeObj,
  FormGroupInput,
  createField,
  convertToNodeObj, createGroup, FieldNodeObj, removeNode } from './store'
import { FieldNode } from './fieldNode'
import { uuID } from './helpers'

export class FormGroup {
  private _id: string;
  label: string;
  private _groupType: 'group' | 'subGroup'; 
  private fields: Group[];
  private fieldsData: FieldNodeObj;
  private subGroups: Group[];
  private subGroupsData: GroupNodeObj;
  private subFields: Group[];
  private subFieldsData: FieldNodeObj;
  private _parent: Root | FormGroup | FieldNode | null;
  private _position: 'group' = 'group';

  constructor(input: FormGroupInput) {
    this._id = input.id || uuID();
    this.label = input.label || `Group ${this._id}`;
    this.fields = input.fields || [];
    this.fieldsData = convertToNodeObj(input.fieldsData, FieldNode, this) as FieldNodeObj;
    this.subGroups = input.subGroups || [];
    this.subGroupsData = convertToNodeObj(input.subGroupsData, FormGroup, this) as GroupNodeObj;
    this.subFields = input.subFields || [];
    this.subFieldsData = convertToNodeObj(input.subFieldsData, FieldNode, this) as FieldNodeObj;
    this._parent = input.parent || null;
    this._groupType = input.groupType;
  }

  get id(): string {
    return this._id;
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

  get parent(): Root | FormGroup | FieldNode | null {
    return this._parent;
  }

  get position(): 'group' {
    return this._position;
  }

  get groupType(): 'group' | 'subGroup' {
    return this._groupType; 
  }

  getSubGroupData(id: string) {
    return this.subGroupsData[id] || null;
  }

  getFieldData(id: string) {
    return this.fieldsData[id] || null;
  }

  getSubFieldData(id: string) {
    return this.subFieldsData[id] || null;
  }

  createNewSubGroup() {
    const [ indObj, groupNode ] = createGroup(this, 'subGroup');
    this.subGroups = [...this.subGroups, indObj as Group];
    this.subGroupsData[(groupNode as FormGroup).id] = groupNode as FormGroup;
    return [this.subGroups, this.subGroupsData];
  }

  removeSubGroup(id: string) {
    const [filteredGroup, cleanData] = removeNode(id, this.subGroups, this.subGroupsData);
    this.subGroups = filteredGroup as Group[];
    this.subGroupsData = cleanData as GroupNodeObj;
    return [this.subGroups, this.subGroupsData]
  }

  creatNewField() {
    const [ indObj, fieldNode ] = createField(this, 'field');
    this.fields = [...this.fields, indObj as Group];
    this.fieldsData[(fieldNode as FieldNode).id] = fieldNode as FieldNode;
    return [this.fields, this.fieldsData];
  }

  removeField(id: string) {
    const [filteredGroup, cleanData] = removeNode(id, this.fields, this.fieldsData);
    this.fields = filteredGroup as Group[];
    this.fieldsData = cleanData as FieldNodeObj;
    return [this.fields, this.fieldsData];
  }

  creatNewSubField() {
    const [ indObj, fieldNode ] = createField(this, 'subField');
    this.subFields = [ ...this.subFields, indObj as Group];
    this.subFieldsData[(fieldNode as FieldNode).id] = fieldNode as FieldNode;
    return [this.subFields, this.subFieldsData]
  }

  removeSubField(id: string) {
    const [filteredGroup, cleanData] = removeNode(id, this.subFields, this.subFieldsData);
    this.subFields = filteredGroup as Group[];
    this.subFieldsData = cleanData as FieldNodeObj;
    return [this.subFields, this.subFieldsData]
  }

  updateSubGroupOrder(list: Group[]) {
    this.subGroups = list;
    list.forEach(item => {
      if (!(item.key in this.subGroupsData)) {
        this.subGroupsData[item.key] = new FormGroup({ 
          id: item.key,
          label:  `Group ${item.key}`,
          parent: this,
          groupType: 'subGroup'})
      }
    })
    return [this.subGroups, this.subGroupsData];
  }

  updateSubFieldOrder(list: Group[]) {
    this.subFields = list;
    list.forEach(item => {
      if (!(item.key in this.subFieldsData)) {
        this.subFieldsData[item.key] = new FieldNode({ 
          id: item.key,
          title:  `Field ${item.key}`,
          parent: this,
          fieldType: 'subField' })
      }
    })
    return [this.subFields, this.subFieldsData];
  }

  updateFieldOrder(list: Group[]) {
    this.fields = list;
    list.forEach(item => {
      if (!(item.key in this.fieldsData)) {
        this.fieldsData[item.key] = new FieldNode({ 
          id: item.key,
          title:  `Field ${item.key}`,
          parent: this,
          fieldType: 'field' })
      }
    })
    return [this.fields, this.fieldsData];
  }

  updateSubGroupItem(item: Group) {
    this.subGroups = this.subGroups.map(obj => {
      return obj.key === item.key ? item : obj
    })
    return this.subGroups;
  }

  updateFieldItem(item: Group) {
    this.fields = this.fields.map(obj => {
      return obj.key === item.key ? item : obj
    })
    return this.fields;
  }

  updateSubFieldItem(item: Group) {
    this.subFields = this.subFields.map(obj => {
      return obj.key === item.key ? item : obj
    })
    return this.subFields;
  }

}