import { Injectable } from "@nestjs/common";
import { SummarizationResult } from "src/video/domain/summarization/entity/summarization-result.entity";
import { Repository } from "typeorm";

@Injectable()
export class SummarizationResultRepository extends Repository<SummarizationResult> {}