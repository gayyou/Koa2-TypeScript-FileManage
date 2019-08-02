export class File {
  constructor(options: any) {
    ({ id: this.id, ownerId: this.ownerId, name: this.name, contentId: this.contentId, url: this.url, path: this.streamPath } = options)
  }
  id: number;
  ownerId: number;
  name: string;
  contentId: number;
  url: string;
  streamPath: string;
}