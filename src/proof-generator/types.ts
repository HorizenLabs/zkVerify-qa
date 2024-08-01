export interface ProofInner {
    a: string;
    b: string;
    c: string;
}

export interface Proof<T> {
    curve: string;
    proof: ProofInner | T;
}

export interface ProofData<T> {
    proof: Proof<T>;
    publicSignals: string;
    vk: any;
}

export interface ProofHandler {
    formatProof(proof: any, publicSignals?: string[]): any;
    formatVk(vkJson: any): any;
    formatPubs(pubs: string[])
}