import { CompanyUpdateHistory } from 'src/modules/company-update-history/company-update-history.entity';
import { CompanyUserUpdateHistory } from 'src/modules/company-user-update-history/company-user-update-history.entity';
import { CompanyDistrictUpdateHistory } from 'src/modules/company-district-update-history/company-district-update-history.entity';

export const NewDataDuplicateKeyRemover = (removableObject: any) => {
  console.log(removableObject);
  for (const [key, value] of Object.entries(removableObject)) {
    if (removableObject[key] === null) {
      delete removableObject[key];
    }
    if (removableObject instanceof CompanyUpdateHistory) {
      delete removableObject.companyStatus;
      delete removableObject.companyNo;
    } else if (removableObject instanceof CompanyUserUpdateHistory) {
      delete removableObject.companyUserStatus;
      delete removableObject.companyUserNo;
      delete removableObject.authCode;
    } else if (removableObject instanceof CompanyDistrictUpdateHistory) {
      delete removableObject.companyNo;
      delete removableObject.companyDistrictStatus;
      delete removableObject.companyDistrictNo;
    }
  }
  delete removableObject.createdAt;
  delete removableObject.updatedAt;
  delete removableObject.no;
  return removableObject;
};
