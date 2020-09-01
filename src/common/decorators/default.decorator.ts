import { Transform } from 'class-transformer';

export const Default = (defaultValue: any) => {
  return Transform((target: any) => target || defaultValue);
};
