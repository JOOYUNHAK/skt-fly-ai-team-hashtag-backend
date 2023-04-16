import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, Param, Post, Put, Query, HttpException, HttpStatus, UseInterceptors, UseFilters, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios";
import { SaveCommentDto } from "./comment-service/dto/comment-service.dto";
import { PushLikeDto } from "./like-service/dto/like-service-request.dto";
import { LoginRequestDto } from "./user-service/dto/login-request.dto";
import { SaveVideoPathDto } from "./video-service/dto/save-video-path.dto";
import { SaveVideoTitleDto } from "./video-service/save-video-title.dto";
import { map, mergeWith, Observable } from "rxjs";
import { ResponseTransformInterceptor } from "./interceptor/transform.interceptor";

@Controller('api/v1')
@UseInterceptors(ResponseTransformInterceptor)
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
  getMyFeedRequest(@Param('id') id: string): Observable<AxiosResponse> {
    try {
      return this.httpService
              .get(`${this.USER_SERVICE}/user/feed/${id}`)
              .pipe( map(response => response.data) )
    }
    catch (err) {
      throw new HttpException(
        '죄송해요. 사용자서버에 문제가 생겨 복구중이에요... router -> user/feed',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('auth/login')
  loginRequest(@Body() loginRequestDto: LoginRequestDto): Observable<AxiosResponse> {
    try {
      const { phoneNumber, nickName } = loginRequestDto;
      return this.httpService
                .post(`${this.USER_SERVICE}/auth/login`, { phoneNumber, nickName })
                .pipe( map(response => response.data) )
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
  videoListRequest(): Observable<AxiosResponse> {
    try {
      return this.httpService
              .get(`${this.VIDEO_SERVICE}/video/list`)
              .pipe( map(response => response.data) )
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
  videoDetailInfoRequest(@Param('videoId') videoId: string): Observable<AxiosResponse> {
    try {
      const [detail$, comments$] = [
        this.httpService
          .get(`${this.VIDEO_SERVICE}/video/detail/${videoId}`)
          .pipe( map( response  => response.data )),
        this.httpService
          .get(`${this.COMMENT_SERVICE}/video/comment/${videoId}`)
          .pipe( map( response => response.data ))
      ];
      return detail$.pipe( mergeWith( comments$ ));
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
  saveThumbNailPath(@Body() saveVideoPathDto: SaveVideoPathDto):Observable<AxiosResponse>  {
    try {
      const { userId, nickName, videoPath } = saveVideoPathDto;
      return this.httpService
              .post(`${this.VIDEO_SERVICE}/video/path`, { userId, nickName, videoPath })
              .pipe( map( response => response.data ))
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
  saveVideoTitle(@Body() saveVideoTitleDto: SaveVideoTitleDto): Observable<AxiosResponse> {
    try {
      const { userId, title } = saveVideoTitleDto;
      return this.httpService
              .post(`${this.VIDEO_SERVICE}/video`, { userId, title })
              .pipe( map( response => response.data ))
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
  notUploadVideo(@Body('userId') userId: string):Observable<AxiosResponse> {
    try {
      return this.httpService
              .put(`${this.VIDEO_SERVICE}/video`, { userId })
              .pipe( map( response => response.data ))
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
  testVideoPathRouter(@Body() testDto: any):Observable<AxiosResponse> {
    try {
      const { userId, nickName, videoPath, category } = testDto;
      return this.httpService
              .post(`${this.VIDEO_SERVICE}/video/path`, { userId, nickName, videoPath, category })
              .pipe( map( response => response.data ))
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
  pushLikeRequest(@Body() pushLikeDto: PushLikeDto): Observable<AxiosResponse> {
    try {
      const { userId, videoId } = pushLikeDto;
      return this.httpService
              .put(`${this.LIKE_SERVICE}/like`, { userId, videoId })
              .pipe( map( response => response.data ))
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
  searchVideoRequest(@Query('keyword') keyword: string): Observable<AxiosResponse> {
    try {
      return this.httpService
              .get(`${this.SEARCH_SERVICE}/search/video`, { params: { keyword } })
              .pipe( map( response => response.data ))
      // return {
      //   statusCode: 200,
      //   message: 'OK',
      //   body: {
      //     data: [
      //       ...data
      //     ]
      //   }
      // }
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
  saveComment(@Body() saveCommentDto: SaveCommentDto): Observable<AxiosResponse> {
    try {
      const { videoId, userId, nickName, content } = saveCommentDto;
      return this.httpService
              .post(`${this.COMMENT_SERVICE}/video/comment`, { videoId, userId, nickName, content })
              .pipe( map( response => response.data ))
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
