import { AutoMap } from "@automapper/classes";

export class LikeRequestDto {
    @AutoMap()
    videoId: string;
    @AutoMap()
    userId: number;
}