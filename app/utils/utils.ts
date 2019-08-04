export function getBasePath(path: string): string {
  let basePathArr: Array<string> = path.split('/');

  if (!basePathArr.length) {
    return '';
  }

  return basePathArr.splice(-1, 1).join('/');
}