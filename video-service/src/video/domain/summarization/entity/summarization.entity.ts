import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SummaryStatus } from "../enum/summary-status.enum";
import { SummarizationResult } from "./summarization-result.entity";
import { AggregateRoot } from "@nestjs/cqrs";
import { AutoMap } from "@automapper/classes";
import { SummarizationCompletedEvent } from "../event/summarization-completed.event";
import { Video } from "../../video/entity/video.entity";
import { UploadedSummarizationVideoEvent } from "../event/uploaded-summarization-video.event";

@Entity('summarization')
export class Summarization extends AggregateRoot {
    @PrimaryGeneratedColumn('increment')
    readonly id: number;

    @Column({ 
        type: 'int', 
        name: 'user_id', 
    })
    @AutoMap()
    readonly userId: number;

    @Column({ 
        type: 'simple-array',
        name: 'origin_video_path',
    })
    @AutoMap()
    readonly originVideoPath: string [];

    @Column({ 
        type: 'simple-array',  
        name: 'category', 
    })
    @AutoMap()
    readonly category: string [];

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true
    })
    @AutoMap()
    title: string; 

    @Column({ 
        type: 'timestamp', 
    }) 
    startedAt: Date;

    @OneToOne(() => SummarizationResult, { 
        cascade: ['insert', 'update', 'remove'] 
    })
    @JoinColumn({ name: 'result_id' })
    result: SummarizationResult

    @Column({
        type: 'timestamp',
        name: 'summarizaed_at',
        nullable: true
    })
    summarizedAt: Date; 

    @Column({
        type: 'timestamp',
        name: 'uploaded_at',
        nullable: true
    })
    @AutoMap()
    uploadedAt: Date;

    @Column({ 
        type: 'enum', 
        enum: SummaryStatus, 
    })
    status: SummaryStatus

    getId(): number { return this.id; };

    getUserId(): number { return this.userId; };

    getOriginVideoPath(): string[] { return this.originVideoPath; };

    getResult(): string { return this.result.getMessage(); }; 

    getOutput(): SummarizationResult { return this.result; };

    setTitle(title: string) { 
        this.title = title; 
        return this;
    };

    private setStartTime(startTime: Date) { this.startedAt = startTime; };

    private setResult( result: SummarizationResult ) { this.result = result; };

    private setSummarizaedTime( summarizaedTime: Date ) { this.summarizedAt = summarizaedTime; };

    private setUploadedTime( uploadedTime: Date ) { this.uploadedAt = uploadedTime; };

    started() {
        this.setResult(SummarizationResult.init())
        this.setStartTime(new Date());
        this.status = SummaryStatus.SUMMARYING; 
    };

    summarized( result: SummarizationResult ) { 
        this.setResult(result);
        this.setSummarizaedTime(new Date()); 
        this.status = SummaryStatus.SUMMARIZED;
        this.apply(new SummarizationCompletedEvent(this));
    };

    upload() {
        this.setUploadedTime(new Date());
        this.status = SummaryStatus.UPLOADED;
        this.apply(new UploadedSummarizationVideoEvent(this))
    }
} 