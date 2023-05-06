export interface IMediaRepository {
    delete:(url: string []) => Promise<void>;
}