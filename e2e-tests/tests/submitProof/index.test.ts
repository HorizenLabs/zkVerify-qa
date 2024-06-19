import 'dotenv/config';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { describe, test, expect, beforeAll, afterAll, beforeEach, afterEach } from '@jest/globals';
import { proofs } from '../../proofs';
import { createApi, waitForNodeToSync } from '../../helpers';
import { handleTransaction, clearResources } from '../../transactions';

const requiredEnvVariables: string[] = ['WEBSOCKET', 'PRIVATE_KEY'];

requiredEnvVariables.forEach(envVar => {
    if (!process.env[envVar]) {
        throw new Error(`Required environment variable ${envVar} is not set.`);
    }
});

describe('Proof Submission and Event Handling', () => {
    let api: ApiPromise;
    let provider: WsProvider;
    let startTime: number;
    let timerRefs = { interval: null as NodeJS.Timeout | null, timeout: null as NodeJS.Timeout | null };

    beforeAll(async () => {
        provider = new WsProvider(process.env.WEBSOCKET as string);
        api = await createApi(provider);
        await waitForNodeToSync(api);
    }, 30000);

    afterAll(async () => {
        clearResources(timerRefs);
        if (api) await api.disconnect();
        if (provider) await provider.disconnect();
    });

    beforeEach(() => {
        startTime = Date.now();
    });

    afterEach(() => {
        clearResources(timerRefs);
    });

    const proofTypes = Object.entries(proofs);

    // TODO: Change this once risc0 args are ordered as per the other pallets.
    const submitProof = (api: ApiPromise, pallet: string, proofType: string, validProof: any, ...params: any[]) => {
        if (proofType === 'risc0') {
            const [vk, ...additionalParams] = params;
            return api.tx[pallet].submitProof(vk, validProof, ...additionalParams);
        } else {
            return api.tx[pallet].submitProof(validProof, ...params);
        }
    };

    test.each(proofTypes)(
        'should successfully accept a %s proof, emit a NewAttestation event',
        async (proofType, { pallet, validProof, params = [] }) => {
            console.log(`Submitting valid ${proofType} proof...`);
            const keyring = new Keyring({ type: 'sr25519' });
            const account = keyring.addFromUri(process.env.PRIVATE_KEY as string);

            const transaction = submitProof(api, pallet, proofType.toString(), validProof, ...params);
            const result = await handleTransaction(api, transaction, account, proofType.toString(), startTime, false, timerRefs);
            expect(result).toBe('succeeded');
        },
        150000
    );

    test.each(proofTypes)(
        'should reject invalid %s proof upon finalization',
        async (proofType, { pallet, invalidProof, params = [] }) => {
            console.log(`Submitting invalid ${proofType} proof...`);
            const keyring = new Keyring({ type: 'sr25519' });
            const account = keyring.addFromUri(process.env.PRIVATE_KEY as string);

            const transaction = submitProof(api, pallet, proofType.toString(), invalidProof, ...params);
            const result = await handleTransaction(api, transaction, account, proofType.toString(), startTime, true, timerRefs);
            expect(result).toBe('failed as expected');
        },
        120000
    );
});
