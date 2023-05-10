export interface INotificationRepository {
    save: (userId: string, emitter: any) => Promise<void>;
    findByUserId: (userId: number) => any;
    delete:(userId: number) => void
}