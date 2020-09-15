export enum UPLOAD_TYPE {
  DELIVERY_SPACE = 'delivery-space',
  BANNER = 'banner',
  POPUP = 'popup',
  INQUIRY = 'inquiry',
  COMPANY_LOGO = 'company-logo',
  COMPANY_USER_ATTACHMENT = 'company-user-attachment',
  COMPANY_DISTRICT = 'company-district',
  BRAND_LOGO = 'brand-logo',
  NOTICE_BOARD = 'notice-board',
  MENU = 'menu',
  MAIN_MENU_IMAGE = 'main-menu-image',
}

export enum ACL {
  PUBLIC = 'public-read',
  PRIVATE = 'private',
}

type S3BucketInfo = {
  bucketName: string;
  cloudFrontUrl: string;
};
type S3BucketInfoEnvironments = {
  [key in 'production' | 'staging']: S3BucketInfo;
};
type UploadOption = {
  path: string;
  sizeLimit: number;
  fileType: FileType;
  // imageSizeArray?: [[number, number], [number, number]?];
  // resized?: boolean;
  // squared?: boolean;
  // cropped?: boolean;
};
type UploadOptionConfig = {
  [key in UPLOAD_TYPE]: UploadOption;
};
type MimeTypes = {
  [key in FileType]: string[];
};
export enum FileType {
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
}
export class UploadConfigService {
  public readonly bucketEndpoint = 'https://kr.object.ncloudstorage.com';
  public readonly bucketInfo: S3BucketInfo;

  public bucketInfoEnvironments: S3BucketInfoEnvironments = {
    production: {
      bucketName: 'production-storage-nanuda',
      cloudFrontUrl: null, // 'https://xxxxx.cloudfront.net',
    },
    staging: {
      bucketName: 'staging-storage-nanuda',
      cloudFrontUrl: null, // 'https://xxxxx.cloudfront.net',
    },
  };

  public readonly bucketTypes: UploadOptionConfig = {
    [UPLOAD_TYPE.DELIVERY_SPACE]: {
      path: 'delivery-space',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.IMAGE,
    },
    [UPLOAD_TYPE.COMPANY_DISTRICT]: {
      path: 'company-district',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.IMAGE,
    },
    [UPLOAD_TYPE.BANNER]: {
      path: 'banner',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.DOCUMENT,
    },
    [UPLOAD_TYPE.POPUP]: {
      path: 'popup',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.DOCUMENT,
    },
    [UPLOAD_TYPE.INQUIRY]: {
      path: 'inquiry',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.DOCUMENT,
    },
    [UPLOAD_TYPE.COMPANY_LOGO]: {
      path: 'company-logo',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.DOCUMENT,
    },
    [UPLOAD_TYPE.BRAND_LOGO]: {
      path: 'brand-logo',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.IMAGE,
    },
    [UPLOAD_TYPE.COMPANY_USER_ATTACHMENT]: {
      path: 'company-user-attachment',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.DOCUMENT,
    },
    [UPLOAD_TYPE.NOTICE_BOARD]: {
      path: 'notice-board',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.DOCUMENT,
    },
    [UPLOAD_TYPE.MENU]: {
      path: 'menu',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.IMAGE,
    },
    [UPLOAD_TYPE.MAIN_MENU_IMAGE]: {
      path: 'main-menu-image',
      sizeLimit: 1024 * 1024 * 10,
      fileType: FileType.IMAGE,
    },
  };

  // 업로드 허용 확장자 정보
  public readonly mimeTypes: MimeTypes;

  constructor() {
    this.bucketInfo = this.bucketInfoEnvironments[process.env.NODE_ENV];
    this.mimeTypes = {
      // 업로드 허용 확장자 설정 (이미지 타입)
      [FileType.IMAGE]: ['image/gif', 'image/png', 'image/jpeg', 'image/jpg'],
      // 업로드 허용 확장자 설정 (문서 타입)
      [FileType.DOCUMENT]: [
        'image/gif',
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/webp',
        'image/heic',
        'application/octet-stream',
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-powerpoint', // .ppt
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/pdf', // .pdf
        'application/zip', // .zip
        'text/csv', // .csv
        'text/plain', // .txt],
      ],
    };
  }

  public getMimeTypes(fileType: FileType): string[] {
    return this.mimeTypes[fileType];
  }
}

export const bucketInfoEnvironments: S3BucketInfoEnvironments = {
  production: {
    bucketName: 'production-storage-nanuda',
    cloudFrontUrl: null, // 'https://xxxxx.cloudfront.net',
  },
  staging: {
    bucketName: 'staging-storage-nanuda',
    cloudFrontUrl: null, // 'https://xxxxx.cloudfront.net',
  },
};
