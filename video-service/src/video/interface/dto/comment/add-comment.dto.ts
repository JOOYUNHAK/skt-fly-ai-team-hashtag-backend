import { AutoMap } from "@automapper/classes";

export class AddCommentDto {
    @AutoMap()
    readonly videoId: string;
    @AutoMap()
    readonly userId: number;
    @AutoMap()
    readonly nickName: string;
    @AutoMap()
    readonly content: string;
}