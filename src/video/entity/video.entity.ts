import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Tag } from "./tag.entity";

@Entity('video')
export class Video {
    @PrimaryGeneratedColumn('increment')
    @ManyToOne(() => Tag, (tag) => tag.id, { onDelete: 'CASCADE' })
    id: number;
    @Column({ type: 'varchar', length: 100, name: 'video_path', nullable: false })
    videoPath:string;
    @Column({ type: 'varchar', length: 100, name: 'image_path', nullable: false })
    imagePath: string;
    @Column({ type: 'text', nullable: false })
    content: string;
    @Column({ type: 'binary', length: 16, nullable: false })
    owner: string;
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at'})
    createdAt: Date;
}