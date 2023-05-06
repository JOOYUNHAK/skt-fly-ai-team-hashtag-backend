import { VideoMetaInfo } from "./video-meta-info";
import { VideoSummaryInfo } from "./video-summary-info";
import { AggregateRoot } from "@nestjs/cqrs";
import { SummarySuccessEvent } from "./event/summary-success.event";
import { SummaryFailEvent } from "./event/summary-fail.event";
import { AutoMap } from "@automapper/classes";

export class Video extends AggregateRoot {
    private videoMetaInfo: VideoMetaInfo;
    private videoSummaryInfo: VideoSummaryInfo;
    @AutoMap()
    private title: string;
    
    constructor( private id: string ) {
        super();
        this.videoSummaryInfo = new VideoSummaryInfo();
    }

    getId() { return this.id };

    getOwnerId() { return this.videoMetaInfo.userId };

    getMetaInfo() { return this.videoMetaInfo; };
    
    getSummaryInfo() { return this.videoSummaryInfo; };

    startSummary() {
        this.videoSummaryInfo.startSummary();
    }
    summarySucceed() {
        this.apply(new SummarySuccessEvent(this));
    }
    summaryFailed() {
        this.apply(new SummaryFailEvent(this));
    }
    setVideoMetaInfo(videoMetaInfo: VideoMetaInfo) {
        this.videoMetaInfo = videoMetaInfo;
        return this;
    }
    setVideoSummaryInfo(videoSummaryInfo: VideoSummaryInfo) {
        this.videoSummaryInfo = videoSummaryInfo;
        return this;
    }
    setTitle(title: string) {
        this.title = title;
    }
}