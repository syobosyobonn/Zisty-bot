interface Reaction {
    
}

interface Config {
    adminRole: string[];
    slaveRole: string;

    reactions: Array<{
        reaction: string;
        channels: string[];
    }>;
}


export type { Reaction, Config };