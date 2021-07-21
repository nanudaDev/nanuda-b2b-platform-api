/* eslint-disable @typescript-eslint/ban-types */
import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import * as errors from 'src/locales/kr/errors.json';

export const isPhone = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isPhone',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: errors.phone.isNotEmpty,
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) {
            return false;
          }
          if (value.length < 10) {
            return false;
          }
          return true;
        },
      },
    });
  };
};
