import { AutoMap } from "@automapper/classes";

export class VideoMetaInfo {
    @AutoMap()
    readonly userId: string;
    @AutoMap()
    readonly nickName: string;
    
    readonly originVideoPath: string[];
    
    readonly category: string[];
}