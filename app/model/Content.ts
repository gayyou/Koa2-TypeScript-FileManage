export class Content {
  constructor(options: any) {
    ({ id: this.id, parendId: this.parentId, name: this.name, level: this.level, path: this.path, ownerId: this.ownerId } = options);
  }
  id: number;
  parentId: number;
  name: string;
  level: number;
  path: string;
  ownerId: number;
}