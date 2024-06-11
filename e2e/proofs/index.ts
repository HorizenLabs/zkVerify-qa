export interface Proof {
    pallet: string;
    validProof: string;
    invalidProof: string;
}

export const proofs: Record<string, Proof> = {
    fflonk: {
        pallet: 'settlementFFlonkPallet',
        validProof: process.env.FFLONK_PROOF as string,
        invalidProof: process.env.INVALID_FFLONK_PROOF as string
    },
    boojum: {
        pallet: 'settlementZksyncPallet',
        validProof: process.env.BOOJUM_PROOF as string,
        invalidProof: process.env.INVALID_BOOJUM_PROOF as string
    }
};
