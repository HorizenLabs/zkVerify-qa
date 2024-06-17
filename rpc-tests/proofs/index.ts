export interface Proofs {
    [key: string]: {
        pallet: string;
        validProof: string;
        invalidProof: string;
        params?: any[];
    };
}

export const proofs: Proofs = {
    fflonk: {
        pallet: 'settlementFFlonkPallet',
        validProof: process.env.FFLONK_PROOF as string,
        invalidProof: process.env.INVALID_FFLONK_PROOF as string,
        params: [null]
    },
    boojum: {
        pallet: 'settlementZksyncPallet',
        validProof: process.env.BOOJUM_PROOF as string,
        invalidProof: process.env.INVALID_BOOJUM_PROOF as string
    }
};
