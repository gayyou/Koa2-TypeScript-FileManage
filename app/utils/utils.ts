export function getBasePath(path: string): string {
  let basePathArr: Array<string> = path.split('/');

  if (!basePathArr.length) {
    return '';
  }
  basePathArr.length = basePathArr.length - 1;
  return basePathArr.join('/');
}