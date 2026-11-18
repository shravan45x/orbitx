export type BlogCategory = 
    | 'All'
    | 'Astrophysics'
    | 'Instrumentation'
    | 'Observation Logs'
    | 'Aerospace Engineering'
    | 'Guides & Tutorials';

export interface BlogAuthor {
    name: string;
    role: string;
    team: string;
}

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    category: Exclude<BlogCategory, 'All'>;
    author: BlogAuthor;
    publishedAt: string;
    readTime: string;
    coverImage: string;
    summary: string;
    content: {
        intro: string;
        sections: {
            heading: string;
            body: string;
            highlight?: string;
        }[];
        conclusion: string;
    };
    tags: string[];
    featured?: boolean;
}
