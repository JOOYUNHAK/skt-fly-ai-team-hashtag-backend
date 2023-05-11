export interface ILikeRepository {
    findByUserAndVideoId: (videoId: string, userId: number) => Promise<number>;
}