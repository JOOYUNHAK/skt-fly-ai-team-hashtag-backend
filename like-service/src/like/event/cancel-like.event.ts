export class CancelLikeEvent {
    constructor(
        readonly userId: string,
        readonly videoId: string
    ) {} 
}