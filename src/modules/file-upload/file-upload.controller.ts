import {
  Controller,
  Get,
  Query,
  UseInterceptors,
  UploadedFile,
  Body,
  Post,
} from '@nestjs/common';
import { BaseController } from 'src/core';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileUploadService } from './file-upload.service';
import { FileUploadPresignedDto } from './dto/file-upload-presigned.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadDto, FileUploadBodyDto, FileAttachmentDto } from './dto';

@Controller()
@ApiBearerAuth()
@ApiTags('FILE UPLOAD')
export class FileUploadController extends BaseController {
  constructor(private readonly fileUploadService: FileUploadService) {
    super();
  }

  @Get('/file-upload/get-buckets')
  async getBuckets() {
    return await this.fileUploadService.getBuckets();
  }

  /**
   * get presigned urls for s3 upload
   * @param {FileUploadPresignedDto} presignedDto
   */
  @ApiOperation({ summary: 'S3 Upload presigned URL' })
  @Post('/file-upload/retrieve-s3-presigned')
  getPresignedUrl(@Body() presignedDto: FileUploadPresignedDto) {
    return this.fileUploadService.getS3TempUploadSignedUrl(presignedDto);
  }

  @Get('/switch-put-cors')
  switchCors() {
    return this.fileUploadService.putBucketCORS();
  }

  // @Post('/file-upload')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({ description: '파일 생성', type: FileUploadDto })
  // @ApiBody({ type: FileUploadBodyDto })
  // @ApiBody({ type: FileUploadPresignedDto })
  // async uploadFile(
  //   @UploadedFile() file,
  //   @Body() fileBody: FileUploadBodyDto,
  //   @Body() presigned: FileUploadPresignedDto,
  // ) {
  //   return await this.fileUploadService.upload(file, fileBody, presigned);
  // }
}
