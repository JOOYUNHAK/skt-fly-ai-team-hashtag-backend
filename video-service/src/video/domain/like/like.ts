import { AutoMap } from "@automapper/classes";

export class Like {
    @AutoMap()
    readonly videoId: string;
    @AutoMap()
    readonly userId: number;
    private count: number;

    setState(flag: number) { 
        flag == 1 ? this.count = -1 : this.count = 1;
    }
    
    getCount() { return this.count; };

    isDuplicated() { return this.count == -1; };
}