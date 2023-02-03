import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, Param, Post, Put, Query, HttpException, HttpStatus } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { PushLikeDto } from "./like-service/dto/like-service-request.dto";
import { LoginRequestDto } from "./user-service/dto/user-service-requests.dto";
import { LoginResponseDto } from "./user-service/dto/user-service-responses.dto";

@Controller('api/v1')
export class ApiGateway {
  constructor( private readonly httpService: HttpService ) {}
  private readonly baseUrl = 'http://localhost';
  /*
   * Service: User/Auth 
   * Router: User: user/ , Auth: auth/
   * Port: 8080
  */
  @Get('user/feed/:id')
  async getMyFeedRequest(@Param('id') id: string): Promise<AxiosResponse<void>> { 
    try {
      const { data } = await this.httpService.axiosRef.get(`${this.baseUrl}:8080/user/feed/${id}`);
      return;
    }
    catch(err) {
      throw new HttpException(
        '죄송해요. 사용자서버에 문제가 생겨 복구중이에요...',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('auth/login')
  async loginRequest(@Body() loginRequestDto: LoginRequestDto): Promise<LoginResponseDto | void> {
    const { phoneNumber, nickName} = loginRequestDto;
    const { data } = await this.httpService.axiosRef.post(`${this.baseUrl}:8080/auth/login`, { phoneNumber, nickName });
  }

  /*
   * Service: video
   * Router: video/
   * Port: 8081 
  */
  @Get('video')
  async videoListRequest() {}

  @Get('video/:videoId')
  async videoDetailInfoRequest(@Param('videoId') videoId: string): Promise<any> {}

  /* 
   * Service: Like 
   * Router: like/ 
   * Port: 8082 
  */
  @Put('like')
  async pushLikeRequest(@Body() pushLikeDto: PushLikeDto): Promise<void> { 
    try {
      const { userId, videoId } = pushLikeDto;
      await this.httpService.axiosRef.put(`${this.baseUrl}:8082/like`, { userId, videoId });
    }
    catch(err) {
      console.log(err)
      throw new HttpException(
        '죄송해요. 좋아요서버에 문제가 생겨 복구중이에요...',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  /*
   * Service: Search
   * Router: search/video/
   * Port: 8083
  */
  @Get('search/video')
  async searchVideoRequest(@Query('keyword') keyword: string) {}
}
