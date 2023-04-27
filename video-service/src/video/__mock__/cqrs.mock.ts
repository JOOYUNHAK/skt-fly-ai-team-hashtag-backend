import { CommandBus, EventBus, QueryBus } from "@nestjs/cqrs";

export const cqrsMock = {
    commandBus: {
        provide: CommandBus,
        useValue: {
            execute: jest.fn()
        }
    },
    queryBus: {
        provide: QueryBus,
        useValue: {
            execute: jest.fn()
        }
    },
    eventBus: {
        provide: EventBus,
        useValue: {
            publish: jest.fn()
        }
    }
}