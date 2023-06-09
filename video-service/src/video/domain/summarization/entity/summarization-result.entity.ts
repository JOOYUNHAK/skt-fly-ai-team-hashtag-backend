import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Summarization } from "./summarization.entity";

@Entity('summarization_result')
export class SummarizationResult {
    @PrimaryGeneratedColumn('increment')
    private id: number;

    @OneToOne(() => Summarization, { onDelete: 'CASCADE' })
    @JoinColumn({
        name: 'summarization_id',
        referencedColumnName: 'id'
    })
    readonly summarizationId: number;

    @Column({
        type: 'varchar',
        name: 'image_path',
        nullable: true
    })
    private imagePath: string;

    @Column({
        type: 'varchar',
        name: 'video_path',
        nullable: true
    })
    private videoPath: string;

    @Column({
        type: 'simple-array',
        name: 'tag',
        nullable: true
    })
    private tags: string[];

    @Column({
        type: 'varchar',
        length: 50,
        nullable: true
    })
    private message: string;

    @Column({
        type: 'timestamp',
        name: 'summarizaed_at',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: true
    })
    private summarizedAt: Date;

    constructor(
        summarizationId: number, 
        message: string,
        imagePath: string = null, 
        videoPath: string = null, 
        tags: string[] = null, 
        ) {
        this.summarizationId = summarizationId;
        this.message = message;
        this.imagePath = imagePath;
        this.videoPath = videoPath;
        this.tags = tags;
    }

    getMessage(): string { return this.message; };

    getTags(): string[] { return this.tags; };

    getImagePath(): string { return this.imagePath; };

    getVideoPath(): string { return this.videoPath; };
}