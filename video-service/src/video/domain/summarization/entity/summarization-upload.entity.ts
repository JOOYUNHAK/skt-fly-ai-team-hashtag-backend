import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Summarization } from "./summarization.entity";

@Entity('summarization_upload')
export class SummarizationUpload {
    @PrimaryGeneratedColumn('increment')
    private id: number;
    @OneToOne(() => Summarization)
    @JoinColumn({ name: 'summarization_id', referencedColumnName: 'id' })
    readonly summarizationId: number;
    @Column({ type: 'varchar' })
    private title: string;
    @Column({ name: 'uploaded_at', default: () => 'CURRENT_TIMESTAMP' })
    private uploadedAt: Date;
}