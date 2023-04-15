import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, Param, Post, Put, Query, HttpException, HttpStatus } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios";
import { SaveCommentDto } from "./comment-service/dto/comment-service.dto";
import { PushLikeDto } from "./like-service/dto/like-service-request.dto";
import { LoginRequestDto } from "./user-service/dto/user-service-requests.dto";
import { LoginResponseDto } from "./user-service/dto/user-service-responses.dto";
import { SaveVideoPathDto } from "./video-service/dto/save-video-path.dto";
import { SaveVideoTitleDto } from "./video-service/save-video-title.dto";

@Controller('api/v1')
export class ApiGateway {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) { }

    private readonly USER_SERVICE: string = this.configService.get('docker.user_service'); 
    private readonly LIKE_SERVICE: string = this.configService.get('docker.like_service');
    private readonly SEARCH_SERVICE: string = this.configService.get('docker.search_service');
    private readonly VIDEO_SERVICE: string = this.configService.get('docker.video_service');
    private readonly COMMENT_SERVICE: string = this.configService.get('docker.comment_service');

  /*
   * Service: User/Auth 
   * Router: User: user/ , Auth: auth/
   * Port: 8080
  */
  @Get('user/feed/:id')
  async getMyFeedRequest(@Param('id') id: string): Promise<any> {
    try {
      //const { data } = await this.httpService.axiosRef.get(`${this.USER_SERVICE}/user/feed/${id}`);
      //return data;
      return { data: [ { videoId: '102', thumbNailPath: "aws path" }, { videoId: "19232", thumbNailPath: "aws apth" } ]};
    }
    catch (err) {
      throw new HttpException(
        '죄송해요. 사용자서버에 문제가 생겨 복구중이에요... router -> user/feed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('auth/login')
  async loginRequest(@Body() loginRequestDto: LoginRequestDto): Promise<LoginResponseDto | void> {
    try {
      const { phoneNumber, nickName } = loginRequestDto;
      const { data } = await this.httpService.axiosRef.post(`${this.USER_SERVICE}/auth/login`, { phoneNumber, nickName });
      return data;
    }
    catch (err) {
      console.log(err)
      throw new HttpException(
        '죄송해요 사용자서버에 문제가 생겨 복구중이에요... router -> auth/login',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /*
   * Service: video
   * Router: video/
   * Port: 8081 
  */
  @Get('video/list')
  async videoListRequest(): Promise<AxiosResponse<any>> {
    try {
      const { data } = await this.httpService.axiosRef.get(`${this.VIDEO_SERVICE}/video/list`);
      return data;
    }
    catch (err) {
      console.log(err)
      throw new HttpException(
        '죄송해요 비디오 서버에 문제가 생겨 복구중이에요... router -> video/list',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('video/detail/:videoId')
  async videoDetailInfoRequest(@Param('videoId') videoId: string): Promise<any> {
	  console.log(videoId)
    try {
      const [videoInfoData, videoCommentData] = await Promise.all([
        this.httpService.axiosRef.get(`${this.VIDEO_SERVICE}/video/detail/${videoId}`),
        this.httpService.axiosRef.get(`${this.COMMENT_SERVICE}/video/comment/${videoId}`)
      ])
      const { data: videoInfoResponseData } = videoInfoData;
      const { data: videoCommentsResponseData } = videoCommentData;
      return {
        statusCode: 200,
        message: 'OK',
        body: {
          detail: {
            ...videoInfoResponseData,
            comments: [
              ...videoCommentsResponseData
            ]
          }
        }
      }
    }
    catch (err) {
      console.log(err)
      throw new HttpException(
        '죄송해요 비디오 서버에 문제가 생겨 복구중이에요... router -> video/detail',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('video/path')
  async saveThumbNailPath(@Body() saveVideoPathDto: SaveVideoPathDto) {
    try {
      const { userId, nickName, videoPath } = saveVideoPathDto;
      this.httpService.axiosRef.post(`${this.VIDEO_SERVICE}/video/path`, { userId, nickName, videoPath })
      return {
        statusCode: 201,
        message: 'OK'
      }
    }
    catch (err) {
      console.log(err)
      throw new HttpException(
        '죄송해요 비디오 서버에 문제가 생겨 복구중이에요... router -> video/path',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('video')
  async saveVideoTitle(@Body() saveVideoTitleDto: SaveVideoTitleDto) {
    try {
      const { userId, title } = saveVideoTitleDto;
      await this.httpService.axiosRef.post(`${this.VIDEO_SERVICE}:8081/video`, { userId, title })
      return;
    }
    catch (err) {
      console.log(err)
      throw new HttpException(
        '죄송해요 비디오 서버에 문제가 생겨 복구중이에요... router -> video',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Put('video')
  async notUploadVideo(@Body('userId') userId: string) {
    try {
      await this.httpService.axiosRef.put(`${this.VIDEO_SERVICE}/video`, { userId });
      return;
    }
    catch (err) {
      console.log(err)
      throw new HttpException(
        '죄송해요 비디오 서버에 문제가 생겨 복구중이에요... router -> video, put...',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Post('test/video/path')
  async testVideoPathRouter(@Body() testDto: any) {
    try {
      const { userId, nickName, videoPath, category } = testDto;
      this.httpService.axiosRef.post(`${this.VIDEO_SERVICE}/video/path`, { userId, nickName, videoPath, category })
      return {
        statusCode: 201,
        message: 'OK'
      }
    }
    catch (err) {
      console.log(err)
      throw new HttpException(
        '죄송해요 비디오 서버에 문제가 생겨 복구중이에요... router -> test/video/path',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /* 
   * Service: Like 
   * Router: like/ 
   * Port: 8082 
  */
  @Put('like')
  async pushLikeRequest(@Body() pushLikeDto: PushLikeDto): Promise<void> {
    try {
      const { userId, videoId } = pushLikeDto;
      await this.httpService.axiosRef.put(`${this.LIKE_SERVICE}/like`, { userId, videoId });
    }
    catch (err) {
      console.log(err)
      throw new HttpException(
        '죄송해요. 좋아요서버에 문제가 생겨 복구중이에요... router -> like',
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
  async searchVideoRequest(@Query('keyword') keyword: string) {
    try {
      const { data } = await this.httpService.axiosRef.get(`${this.SEARCH_SERVICE}/search/video`, { params: { keyword } });
      return {
        statusCode: 200,
        message: 'OK',
        body: {
          data: [
            ...data
          ]
        }
      }
    }
    catch (err) {
      console.log(err)
      throw new HttpException(
        '죄송해요 검색 서버에 문제가 생겨 복구중이에요.... router -> search/video',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  /*
   * Service: Comment
   * Router: video/comment
   * Port: 8084
  */
  @Post('video/comment')
  async saveComment(@Body() saveCommentDto: SaveCommentDto) {
    try {
      const { videoId, userId, nickName, content } = saveCommentDto;
      await this.httpService.axiosRef.post(`${this.COMMENT_SERVICE}/video/comment`, { videoId, userId, nickName, content });
      return;
    }
    catch (err) {
      console.log(err)
      throw new HttpException(
        '죄송해요 댓글 서버에 문제가 생겨 복구중이에요.... router -> video/comment',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
