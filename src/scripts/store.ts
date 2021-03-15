import { Store, GroupDataObj, GroupData, Group, Field, FieldDataObj } from '../interface/store'
import { FormGroup } from './formGroup'

interface Constructable<T> {
  new(...args: any) : T;
}

export interface FormGroupInput extends GroupData {
  parent: Root | FormGroup
}

export interface FormFieldInput extends Field {
  parent: Root | FormGroup | null
}

export interface GroupNodeObj {
  [key: string]: FormGroup;
}

export function convertToNodeObj(
  obj: GroupDataObj | FieldDataObj,
  nodeClass: Constructable<FormGroup>,
  parent: Root | FormGroup): GroupNodeObj {
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

function createGroup( parent: Root | FormGroup, obj?: GroupData ) {
    const node = new FormGroup({...obj, parent})
    
    const group: Group = {
      key: node.gID,
      label: node.gLabel || 'Group'
    }
    
    return [group, node];
}

export class Root {
  private title: string;
  private description: string;
  private group: Group[];
  private groupData: GroupNodeObj;

  constructor(
    title: string = '', 
    description: string = '',
    group: Group[] = [],
    groupData: GroupDataObj = {}) {
    this.title = title;
    this.description = description;
    this.group = group;
    this.groupData = convertToNodeObj(groupData, FormGroup, this);
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

  set titleVal(str: string) {
    this.title = str;
  }

  set descriptionVal(str: string) {
    this.description = str;
  }

  getGroupData(id: string) {
    return this.groupData[id] || null;
  }

  createNewGroup() {
    const [ indObj, groupNode ] = createGroup(this);
    this.group.push(indObj as Group);
    this.groupData[(groupNode as FormGroup).gID] = groupNode as FormGroup;
  }

  removeGroup(id: string) {
    const [filteredGroup, cleanData] = removeNode(id, this.group, this.groupData);
    this.group = filteredGroup as Group[];
    this.groupData = cleanData as GroupNodeObj;
  }
}

