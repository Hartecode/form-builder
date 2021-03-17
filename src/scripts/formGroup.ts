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
  private id: string;
  label: string;
  private fields: Group[];
  private fieldsData: FieldNodeObj;
  private subGroups: Group[];
  private subGroupsData: GroupNodeObj;
  private subFields: Group[];
  private subFieldsData: FieldNodeObj;
  private parent: Root | FormGroup | FieldNode | null;
  private _position: 'group' = 'group';

  constructor(input: FormGroupInput) {
    this.id = input.id || uuID();
    this.label = input.label || `Group`;
    this.fields = input.fields || [];
    this.fieldsData = convertToNodeObj(input.fieldsData, FieldNode, this) as FieldNodeObj;
    this.subGroups = input.subGroups || [];
    this.subGroupsData = convertToNodeObj(input.subGroupsData, FormGroup, this) as GroupNodeObj;
    this.subFields = input.subFields || [];
    this.subFieldsData = convertToNodeObj(input.subFieldsData, FieldNode, this) as FieldNodeObj;
    this.parent = input.parent || null;
  }

  get gID(): string {
    return this.id;
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

  get gParent(): Root | FormGroup | FieldNode | null {
    return this.parent;
  }

  get position(): 'group' {
    return this._position;
  }

  getSubGroupData(id: string) {
    return this.subGroupsData[id] || null;
  }

  createNewSubGroup() {
    const [ indObj, groupNode ] = createGroup(this);
    this.subGroups = [...this.subGroups, indObj as Group];
    this.subGroupsData[(groupNode as FormGroup).gID] = groupNode as FormGroup;
    return [this.subGroups, this.subGroupsData];
  }

  removeSubGroup(id: string) {
    const [filteredGroup, cleanData] = removeNode(id, this.subGroups, this.subGroupsData);
    this.subGroups = filteredGroup as Group[];
    this.subGroupsData = cleanData as GroupNodeObj;
    return [this.subGroups, this.subGroupsData]
  }

  creatNewField() {
    const [ indObj, fieldNode ] = createField(this);
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
    const [ indObj, fieldNode ] = createField(this);
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
          parent: this })
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
          parent: this })
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
          parent: this })
      }
    })
    return [this.fields, this.fieldsData];
  }

}