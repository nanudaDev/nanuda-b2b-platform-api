import { CompanyUpdateHistory } from 'src/modules/company-update-history/company-update-history.entity';
import { CompanyUserUpdateHistory } from 'src/modules/company-user-update-history/company-user-update-history.entity';
import { CompanyDistrictUpdateHistory } from 'src/modules/company-district-update-history/company-district-update-history.entity';

export const DuplicateKeyRemover = (
  removableObject: any,
  parentObject: any,
) => {
  for (const [key, value] of Object.entries(removableObject)) {
    if (removableObject[key] === parentObject[key]) {
      delete removableObject[key];
    }
    if (removableObject[key] === null) {
      delete removableObject[key];
    } else if (removableObject instanceof CompanyUpdateHistory) {
      delete removableObject.companyNo;
    } else if (removableObject instanceof CompanyUserUpdateHistory) {
      delete removableObject.companyUserNo;
    } else if (removableObject instanceof CompanyDistrictUpdateHistory) {
      delete removableObject.companyDistrictNo;
      delete removableObject.companyNo;
    }
  }
  delete removableObject.createdAt;
  delete removableObject.updatedAt;
  delete removableObject.no;
  return removableObject;
};
