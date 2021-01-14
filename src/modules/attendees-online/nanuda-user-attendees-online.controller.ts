import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BaseController } from "src/core";
import { NanudaAttendeesOnlineService } from "./nanuda-user-attendees-online.service";
@Controller()
@ApiTags('ATTENDEES ONLINE')
export class NanudaAttendeesOnlineController extends BaseController {
    constructor(
        private readonly attendeesOnlineService: NanudaAttendeesOnlineService
    ) {
        super()
    }
}