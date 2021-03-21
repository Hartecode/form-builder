import { Store, GroupDataObj, GroupData, Group, Field, FieldDataObj } from '../interface/store'
import { FormGroup } from './formGroup'
import { FieldNode } from './fieldNode'

interface Constructable<T> {
  new(...args: any) : T;
}

export interface FormGroupInput extends Partial<GroupData> {
  parent: Root | FormGroup | FieldNode | null;
  groupType: 'group' | 'subGroup';
}

export interface FormFieldInput extends Partial<Field> {
  parent: FormGroup | FieldNode | null;
  fieldType: 'field' | 'subField';
}

export interface GroupNodeObj {
  [key: string]: FormGroup;
}

export interface FieldNodeObj {
  [key: string]: FieldNode;
}

export function convertToNodeObj(
  obj: GroupDataObj | FieldDataObj,
  nodeClass: Constructable<FormGroup| FieldNode>,
  parent: Root | FormGroup | FieldNode): GroupNodeObj | FieldNodeObj {
  let data = {};

  for (const key in obj) {
    data[key] = new nodeClass({ ...obj[key], parent})
  }

  return data;
}

export function removeNode(
  id: string,
  groupArr: Group[],
  dataObj: { [key: string]: unknown}) {
    const filteredGroup = groupArr.filter(v => v.key !== id);
    const cleanData = Object.keys(dataObj).reduce((acc, cur) => {
      if (cur !== id) {
        acc[cur] = dataObj[cur]
      }
      return acc;
    }, {} as { [key: string]: unknown});
    return [filteredGroup, cleanData];
}

export function createGroup(
  parent: Root | FormGroup | FieldNode,
  groupType: 'group' | 'subGroup',
  obj?: GroupData) {
    const node = new FormGroup({...obj, parent, groupType})
    
    const group: Group = {
      key: node.id,
      label: node.label
    }
    
    return [group, node];
}

export function createField(
  parent: FormGroup | FieldNode,
  fieldType: 'field' | 'subField',
  obj?: Field) {
  const node = new FieldNode({...obj, parent, fieldType }) 
  
  const group: Group = {
    key: node.id,
    label: node.title
  }
  
  return [group, node];
}

export class Root {
  id: string = 'onlyRoot'
  private title: string;
  private description: string;
  private group: Group[];
  private groupData: GroupNodeObj;
  private _position: 'root' = 'root';

  constructor(
    { title = '', 
    description = '',
    group = [],
    groupData = {}}: Store) {
    this.title = title;
    this.description = description;
    this.group = group;
    this.groupData = convertToNodeObj(groupData, FormGroup, this) as GroupNodeObj;
  }

  get titleVal(): string {
    return this.title
  }

  get descriptionVal(): string {
    return this.description;
  }

  get groupList(): Group[] {
    return this.group;
  }

  get position() {
    return this._position;
  }

  set titleVal(str: string) {
    this.title = str;
  }

  set descriptionVal(str: string) {
    this.description = str;
  }

  getStoreData(): Store {
    return {
      title: this.title,
      description: this.description,
      group: this.group,
      groupData: Object.keys(this.groupData)
        .reduce((acc, cur) => {
          acc[cur] = this.groupData[cur].getGroupData()
          return acc
        }, {})
    }
  }

  getGroupData(id: string) {
    return this.groupData[id] || null;
  }

  createNewGroup() {
    const [ indObj, groupNode ] = createGroup(this, 'group');
    this.group = [...this.group, indObj as Group];
    this.groupData[(groupNode as FormGroup).id] = groupNode as FormGroup;
    return [this.group, this.groupData];
  }

  removeGroup(id: string) {
    const [filteredGroup, cleanData] = removeNode(id, this.group, this.groupData);
    this.group = filteredGroup as Group[];
    this.groupData = cleanData as GroupNodeObj;
    return [this.group, this.groupData];
  }

  updateGroupItem(item: Group) {
    this.group = this.group.map(obj => {
      return obj.key === item.key ? item : obj
    })
    return this.group;
  }

  updateGroupOrder(list: Group[]) {
    this.group = list;
    list.forEach(item => {
      if (!(item.key in this.groupData)) {
        this.groupData[item.key] = new FormGroup({ 
          id: item.key,
          label:  `Group ${item.key}`,
          parent: this,
          groupType: 'group' })
      }
    })
    return [this.group, this.groupData];
  }

}

