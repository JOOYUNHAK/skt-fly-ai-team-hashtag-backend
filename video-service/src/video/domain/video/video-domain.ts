import { VideoMetaInfo } from "./video-meta-info";
import { VideoSummaryInfo } from "./video-summary-info";
import { AggregateRoot } from "@nestjs/cqrs";
import { SummaryCompleteEvent } from "./event/summary-complete.event";
import { VideoStatus } from "./enum/video-status.enum";

export class Video extends AggregateRoot {
    private videoMetaInfo: VideoMetaInfo;
    private videoSummaryInfo: VideoSummaryInfo;
    private status: VideoStatus;
    private title: string;
    
    constructor( private id: string ) {
        super();
        this.status = VideoStatus.CREATED;
    }

    getId() { return this.id };

    startSummary() {
        this.status = VideoStatus.SUMMARYING;
    }
    completeSummary() {
        this.status = VideoStatus.SUMMARIED;
        this.apply(new SummaryCompleteEvent(this));
    }
    setVideoMetaInfo(videoMetaInfo: VideoMetaInfo) {
        this.videoMetaInfo = videoMetaInfo;
    }
    setVideoSummaryInfo(videoSummaryInfo: VideoSummaryInfo) {
        this.videoSummaryInfo = videoSummaryInfo;
    }
    setTitle(title: string) {
        this.title = title;
    }
}