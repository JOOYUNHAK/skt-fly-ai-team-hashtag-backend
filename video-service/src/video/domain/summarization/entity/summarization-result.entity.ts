import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { AutoMap } from "@automapper/classes";

@Entity('summarization_result')
export class SummarizationResult {
    @PrimaryGeneratedColumn('increment')
    readonly id: number;
 
    @Column({
        type: 'varchar',
        name: 'image_path',
        nullable: true
    })
    @AutoMap()
    readonly imagePath: string; 

    @Column({
        type: 'varchar', 
        name: 'video_path',
        nullable: true
    })
    @AutoMap()
    readonly videoPath: string; 

    @Column({
        type: 'simple-array',
        name: 'tag',
        nullable: true 
    })
    readonly tags: string []; 

    @Column({  
        type: 'varchar',  
        length: 50, 
        nullable: true
    })  
    @AutoMap() 
    readonly message: string;

    static init(): SummarizationResult { return new SummarizationResult() }
    
    getMessage(): string { return this.message; };

    getTags(): string[] { return this.tags; }; 

    getImagePath(): string { return this.imagePath; };

    getVideoPath(): string { return this.videoPath; }; 
}