import { BadRequestException } from '@nestjs/common';

export const HyphenRemover = (value: string): string => {
  if (!value) {
    throw new BadRequestException({ message: 'no value' });
  }
  value = value.replace(/-/g, '');
  return value;
};
