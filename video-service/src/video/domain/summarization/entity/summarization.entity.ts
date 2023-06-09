import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SummaryStatus } from "../enum/summary-status.enum";
import { SummarizationResult } from "./summarization-result.entity";
import { AggregateRoot } from "@nestjs/cqrs";
import { SummarizationCompletedEvent } from "../event/summarization-completed.event";
import { UploadedSummarizationVideoEvent } from "../event/uploaded-summarization-video.event";

@Entity('summarization')
export class Summarization extends AggregateRoot {
    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @Column({ 
        type: 'varchar',
        length: 11, 
        name: 'user_id', 
    })
    readonly userId: string;

    @Column({ 
        type: 'simple-array',
        name: 'origin_video_path',
    })
    readonly originVideoPath: string [];

    @Column({ 
        type: 'simple-array',  
        name: 'category', 
    })
    readonly category: string [];

    @Column({ 
        type: 'timestamp', 
        name: 'started_at',
        default: () => 'CURRENT_TIMESTAMP'
    }) 
    private startedAt: Date;

    @OneToOne(() => SummarizationResult, (result) => result.summarizationId)
    readonly result: Promise<SummarizationResult>

    @Column({ 
        type: 'enum', 
        enum: SummaryStatus, 
    })
    status: SummaryStatus

    constructor(id: number, userId: string, originVideoPath: string[], category: string[]) {
        super();
        this.id = id;
        this.userId = userId;
        this.originVideoPath = originVideoPath;
        this.category = category;
    };

    getId(): number { return this.id; };

    getUserId(): string { return this.userId; };

    getOriginVideoPath(): string[] { return this.originVideoPath; };

    getStatus(): SummaryStatus { return this.status; };

    //getResult(): string { return this.result.getMessage(); }; 

    //getOutput(): SummarizationResult { return this.result; };

    // setTitle(title: string) { 
    //     this.title = title; 
    //     return this;
    // };

    //private setResult( result: SummarizationResult ) { this.result = result; };

    //private setSummarizaedTime( summarizaedTime: Date ) { this.summarizedAt = summarizaedTime; };

   // private setUploadedTime( uploadedTime: Date ) { this.uploadedAt = uploadedTime; };

    started() { this.status = SummaryStatus.SUMMARYING; };

    summarized() { 
        this.status = SummaryStatus.SUMMARIZED;
        this.apply(new SummarizationCompletedEvent(this));
    };

    upload() {
        //this.setUploadedTime(new Date());
        this.status = SummaryStatus.UPLOADED;
        this.apply(new UploadedSummarizationVideoEvent(this))
    }
} 