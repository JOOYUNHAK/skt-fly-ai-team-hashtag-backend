import { Body, Controller, Post } from "@nestjs/common";

@Controller('video')
export class VideoController{
    @Post()
    async upload(@Body() data: any) {
        
    }
}