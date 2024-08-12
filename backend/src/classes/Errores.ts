export class NotAnymoreTicketsError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotAnymoreTicketsError';
    }
}

export class TicketNotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'TicketNotFoundError';
    }
}