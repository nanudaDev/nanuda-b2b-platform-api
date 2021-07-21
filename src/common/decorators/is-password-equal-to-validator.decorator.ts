/* eslint-disable @typescript-eslint/ban-types */
import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';
import * as errors from 'src/locales/kr/errors.json';

export const IsPasswordEqualTo = (
  property: string,
  validationOptions?: ValidationOptions,
) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'IsPasswordEqualTo',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: errors.password.isEqaulTo,
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) {
            return false;
          }
          const [newPasswordAttempt] = args.constraints;
          const newPassword = (args.object as any)[newPasswordAttempt];
          if (newPassword !== value) {
            return false;
          }
          return true;
        },
      },
    });
  };
};
