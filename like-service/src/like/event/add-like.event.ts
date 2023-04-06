export class AddLikeEvent {
    constructor(
        readonly userId: string,
        readonly videoId: string
    ) {}
}