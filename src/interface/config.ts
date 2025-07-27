interface Reaction {
    
}

interface Config {
    role: {
        admin: string[];
        slave: string;
        member: string;
    }

    reactions: Array<{
        reaction: string;
        channels: string[];
    }>;
}


export type { Reaction, Config };