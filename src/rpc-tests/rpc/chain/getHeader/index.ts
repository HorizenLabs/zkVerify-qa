import fetchAPI from "../../../utils/fetchAPI";
import { JSONRPC } from "../../../utils/types";
import fixtures from "../../../fixtures";

const chain_getHeader = async (blockHash: string | null = null): Promise<JSONRPC> => {
    const params = blockHash ? [blockHash] : [];

    return await fetchAPI({
        options: {
            id: fixtures.id,
            jsonrpc: fixtures.jsonrpc,
            method: "chain_getHeader",
            params: params,
        },
    });
};

export default chain_getHeader;