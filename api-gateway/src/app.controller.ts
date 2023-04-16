import { HttpService } from "@nestjs/axios";
import { Body, Controller, Get, Param, Post, Put, Query, HttpException, HttpStatus, UseInterceptors, UseFilters } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosResponse } from "axios";
import { SaveCommentDto } from "./comment-service/dto/comment-service.dto";
import { PushLikeDto } from "./like-service/dto/like-service-request.dto";
import { LoginRequestDto } from "./user-service/dto/login-request.dto";
import { SaveVideoPathDto } from "./video-service/dto/save-video-path.dto";
import { SaveVideoTitleDto } from "./video-service/save-video-title.dto";
import { map, mergeWith, Observable } from "rxjs";
import { ResponseTransformInterceptor } from "./interceptor/transform.interceptor";
import { AllHttpExceptionFilter } from "./filter/http-exception.filter";

@Controller('api/v1')
@UseInterceptors(ResponseTransformInterceptor)
@UseFilters(AllHttpExceptionFilter)
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
    return this.httpService
      .get(`http://127.0.0.1:8080/user/feed/${id}`)
      .pipe(map(response => response.data))
  }

  @Post('auth/login')
  loginRequest(@Body() loginRequestDto: LoginRequestDto): Observable<AxiosResponse> {
    const { phoneNumber, nickName } = loginRequestDto;
    return this.httpService
      .post(`${this.USER_SERVICE}/auth/login`, { phoneNumber, nickName })
      .pipe(map(response => response.data))
  }

  /*
   * Service: video
   * Router: video/
   * Port: 8081 
  */
  @Get('video/list')
  videoListRequest(): Observable<AxiosResponse> {
    return this.httpService
      .get(`${this.VIDEO_SERVICE}/video/list`)
      .pipe(map(response => response.data))
  }

  @Get('video/detail/:videoId')
  videoDetailInfoRequest(@Param('videoId') videoId: string): Observable<AxiosResponse> {
    const [detail$, comments$] = [
      this.httpService
        .get(`${this.VIDEO_SERVICE}/video/detail/${videoId}`)
        .pipe(map(response => response.data)),
      this.httpService
        .get(`${this.COMMENT_SERVICE}/video/comment/${videoId}`)
        .pipe(map(response => response.data))
    ];
    return detail$.pipe(mergeWith(comments$));
  }

  @Post('video/path')
  saveThumbNailPath(@Body() saveVideoPathDto: SaveVideoPathDto): Observable<AxiosResponse> {
    const { userId, nickName, videoPath } = saveVideoPathDto;
    return this.httpService
      .post(`${this.VIDEO_SERVICE}/video/path`, { userId, nickName, videoPath })
      .pipe(map(response => response.data))
  }

  @Post('video')
  saveVideoTitle(@Body() saveVideoTitleDto: SaveVideoTitleDto): Observable<AxiosResponse> {
    const { userId, title } = saveVideoTitleDto;
    return this.httpService
      .post(`${this.VIDEO_SERVICE}/video`, { userId, title })
      .pipe(map(response => response.data))
  }

  @Put('video')
  notUploadVideo(@Body('userId') userId: string): Observable<AxiosResponse> {
    return this.httpService
      .put(`${this.VIDEO_SERVICE}/video`, { userId })
      .pipe(map(response => response.data))
  }

  @Post('test/video/path')
  testVideoPathRouter(@Body() testDto: any): Observable<AxiosResponse> {
    const { userId, nickName, videoPath, category } = testDto;
    return this.httpService
      .post(`${this.VIDEO_SERVICE}/video/path`, { userId, nickName, videoPath, category })
      .pipe(map(response => response.data))
  }

  /* 
   * Service: Like 
   * Router: like/ 
   * Port: 8082 
  */
  @Put('like')
  pushLikeRequest(@Body() pushLikeDto: PushLikeDto): Observable<AxiosResponse> {
    const { userId, videoId } = pushLikeDto;
    return this.httpService
      .put(`${this.LIKE_SERVICE}/like`, { userId, videoId })
      .pipe(map(response => response.data))
  }

  /*
   * Service: Search
   * Router: search/video/
   * Port: 8083
  */
  @Get('search/video')
  searchVideoRequest(@Query('keyword') keyword: string): Observable<AxiosResponse> {
    return this.httpService
      .get(`${this.SEARCH_SERVICE}/search/video`, { params: { keyword } })
      .pipe(map(response => response.data))
  }

  /*
   * Service: Comment
   * Router: video/comment
   * Port: 8084
  */
  @Post('video/comment')
  saveComment(@Body() saveCommentDto: SaveCommentDto): Observable<AxiosResponse> {
    const { videoId, userId, nickName, content } = saveCommentDto;
    return this.httpService
      .post(`${this.COMMENT_SERVICE}/video/comment`, { videoId, userId, nickName, content })
      .pipe(map(response => response.data))
  }
}
