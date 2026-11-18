export interface NewsletterSubscriber {
    id?: string;
    email: string;
    status: 'active' | 'unsubscribed';
    source: string;
    subscribedAt: string;
    createdAt?: any;
    resubscribedAt?: string;
}

export interface NewsletterSubscribeResult {
    success: boolean;
    alreadySubscribed?: boolean;
    message: string;
}
