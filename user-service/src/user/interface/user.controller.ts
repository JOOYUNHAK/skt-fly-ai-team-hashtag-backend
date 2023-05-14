import { HttpService } from "@nestjs/axios";
import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { AxiosResponse } from "axios";
import { MyFeedResponseDto } from "./dto/my-feed-response.dto";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../application/user.service";

@Controller('user')
export class UserController {
    constructor( 
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {}
    @Get('feed/:id')
    getMyFeed(@Param('id') id: number): Observable<AxiosResponse<MyFeedResponseDto []>> {
        return this.httpService
                .get(`${this.configService.get('video_service')}/video/image/${id}`)
                .pipe( map(response => response.data) );
    }

    @Get('nickname/:id')
    async getUserNickName(@Param('id', ParseIntPipe) id: number): Promise<string> {
        return await this.userService.getUserNickName(id);
    }

}
