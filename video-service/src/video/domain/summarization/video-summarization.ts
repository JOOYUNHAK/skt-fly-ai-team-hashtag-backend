import { AggregateRoot } from "@nestjs/cqrs";
import { VideoMetaInfo } from "./video-meta-info";
import { SummaryStatus } from "./enum/summary-status.enum";
import { ResultInfo } from "./result-info";
import { SummarizationCompletedEvent } from "./event/summarization-completed.event";
import { AutoMap } from "@automapper/classes";

export class VideoSummarization extends AggregateRoot {
    private metaInfo: VideoMetaInfo;
    private resultInfo: ResultInfo;
    private title: string;
    @AutoMap()
    private status: SummaryStatus;
    
    constructor(
        private _id: string
    ) { super(); }

    start(metaInfo: VideoMetaInfo) { 
        this.metaInfo = metaInfo;
        this.status = SummaryStatus.SUMMARYING; 
    };

    complete(resultInfo: ResultInfo) {
        this.resultInfo = resultInfo;
        this.status = SummaryStatus.COMPLETED;
        this.apply(new SummarizationCompletedEvent(this));
    }

    getId() { return this._id; };
    
    getMetaInfo() { return this.metaInfo; };

    getResultInfo() { return this.resultInfo };

    setTitle(title: string) { this.title = title; };

}