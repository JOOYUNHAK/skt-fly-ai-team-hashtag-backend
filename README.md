# 자동 브이로그 생성 서비스 VideoDot
> 개발 기간: 2023.01 ~ 2023.02

## Introduce
SKT FLY AI 과정에서 진행한 프로젝트로 AI 기술을 활용한 쉽고 빠른 원클릭 자동 브이로그 생성 서비스입니다.

## To Solve
누구나 자신의 일상을 영상으로 공유할 수 있는 수단이 많아진 요즘! 하루를 영상으로 기록하는 "MZ 세대"의 비율은 늘어나고 있어요.

하지만 하나의 영상을 편집하려면 오랜 시간이 소요되고, 영상 편집 기술이 부족해 자신의 브이로그를 생성하는데 많은 사람들이 어려움을 겪고 있어요.  

저희 VideoDot은 AI기술을 활용해 빠르고 편리하게 영상을 요약해 브이로그를 생성해 드리면서 이런 어려움을 해결해드리기 위해 제작되었어요.

앱의 시연 영상은 [여기](https://github.com/skt-fly-teamHashTag/Frontend/blob/master/README.md#%EC%8B%A4%ED%96%89-%EC%98%81%EC%83%81)에서 확인하실 수 있습니다!

## Features
- 자신의 앨범에 영상만 있다면 바로 요약해볼 수 있어요.
- 해시태그와 썸네일까지! 영상을 보시고 제목만 설정해 주세요.
- 브이로그가 생성되는 동안 기다리지 않고 앱의 다른 기능들을 이용할 수 있어요.
- 생성된 브이로그가 마음에 든다면 앱 내의 다른 사용자들이 볼 수 있도록 업로드 할 수 있어요.
- 업로드하지 않고 소장하고 싶으시다면 자신의 기기 앨범에만 저장할 수 있어요.
- 다른 분들의 영상을 보면서 댓글과 좋아요로 소통할 수 있어요.
- 검색을 통해 취향에 맞는 브이로그들을 찾아 보실 수 있어요.

## Members
- [BBIYAC](https://github.com/BBIYAC): 사용자들의 화면을 담당하여 단독으로 개발했어요.
- [eunsun52](https://github.com/eunsun53): AI팀에서 영상 요약 과정을 단독으로 담당했어요.
- [rkskek1226](https://github.com/rkskek1226): AI팀에서 브이로그의 썸네일을 단독으로 담당했어요.
- [soyeong-kim](https://github.com/soyeong-kim): AI팀에서 브이로그의 해시태그 추출을 공동으로 담당했어요.
- [qqq3964](https://github.com/qqq3964): AI팀에서 브이로그의 해시태그 추출을 공동으로 담당했어요.
 

## Environment & Stack
<p>
<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/></a>&nbsp 
<img src="https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=NestJS&logoColor=white"/></a>&nbsp 
<img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=MongoDB&logoColor=white"/></a>&nbsp 
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white"/></a>&nbsp 
<img src="https://img.shields.io/badge/AWS EC2-FF9900?style=flat-square&logo=AWS EC2&logoColor=white"/></a>&nbsp 
<img src="https://img.shields.io/badge/AWS S3-569A31?style=flat-square&logo=AWS S3&logoColor=white"/></a>&nbsp 
<img src="https://img.shields.io/badge/Docker-569A31?style=flat-square&logo=Docker&logoColor=white"/></a>&nbsp 
</p>

```sh
# Ubuntu - Version - 20.04.5 #
# Nvm - Version - 0.39.3 #
# Npm - Version - 8.19.2 #
# Node - Version - 18.12.1 #
```

## API Specification
제가 작성했던 API 명세서는 [여기](https://video-dot-project.gitbook.io/video_dot-api/)에서 확인하실 수 있어요

## Implement
- 기능  
    - **좋아요**와 **댓글** 기능을 담당하여 구현했어요.
    - MongoDB Atlas의 Search를 사용해 **검색** 기능을 구현했어요.
    - 브이로그, 일상과 같은 **동의어**를 설정하여 적용했어요.
    - SSE(Server-Sent-Events)를 사용해 영상 요약 결과에 대한 알림을 구현했어요. 
    - AWS **S3**를 이용해 이미지와 영상을 저장 했어요.
    - 영상 요약 과정의 **아키텍처**를 담당했어요.
- 인프라
    - AWS **EC2**에 테스트 서버를 배포하고 **Elastic IP**를 적용했어요.
    - **Docker Compose**를 사용해 각 Service별로 존재하는 Docker를 관리했어요.