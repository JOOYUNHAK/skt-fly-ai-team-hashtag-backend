import { AutoMap } from "@automapper/classes";

export class ResultInfo {
    @AutoMap()
    private summarizationId: string;
    @AutoMap()
    private message: string;
    @AutoMap()
    readonly imagePath?: string;
    @AutoMap()
    readonly videoPath?: string;

    readonly tags?: string[];

    getId() { return this.summarizationId; };

    getMessage() { return this.message; };
}   