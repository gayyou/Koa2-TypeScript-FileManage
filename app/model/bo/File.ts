export class File {
  constructor(options: any) {
    ({ id: this.id, ownerId: this.ownerId, name: this.name, contentId: this.contentId, contentPath: this.contentPath, path: this.streamPath, url: this.url } = options)
  }
  id: number;
  ownerId: number;
  name: string;
  contentId: number;
  contentPath: string;
  streamPath: string;
  url: string;
}