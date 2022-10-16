import { PUBLIC_URL } from 'src/configs';

const generateResourcePath = (relativePath: string) => {
  return `${PUBLIC_URL}${relativePath}`;
};
export default generateResourcePath;
