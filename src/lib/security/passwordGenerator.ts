import { customAlphabet } from "nanoid";

const passwordGenerator = () => {
  const alphabet = '123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 8);
  return nanoid();
};

export default passwordGenerator;