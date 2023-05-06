export interface INotificationRepository {
    save: (userId: string, emitter: any) => Promise<void>;
    findByUserId: (userId: string) => any;
    delete:(userId: string) => void
}