interface Proof {
    curve: string;
    proof: {
        a: string;
        b: string;
        c: string;
    };
}

interface VerificationKey {
    curve: string;
    alphaG1: string;
    betaG2: string;
    gammaG2: string;
    deltaG2: string;
    gammaAbcG1: string[];
}

interface ProofData {
    proof: Proof;
    invalid_proof: Proof;
    pubs: string[];
    vk: VerificationKey;
}

const PROOF_JSON = `{
    "curve": "Bn254",
    "proof": {
        "a": "0x976e8832975ade909192a185fb553f7f66d7ff0b58b2ac69e63635632213011f2fad7e996a95ecdbdf251a2526c7c856f894035765fd8c6e6ebde0bd25f9660d",
        "b": "0x5bc1574562bdb6279caa6e0fe6c228aea9b4ed14d7411f080e5a365d86c30c1901a3f19010881db71db8d73af7ffb80303455625bbd34a8e7e3e3a2d2e194324a86a07c4faf9ba2d96c52af5dc265958b2a9d98823461828fa9d0a65d3830f19fee8146afff5565b27514ab317b08647624a49804081542994ebd7b6e6b20d14",
        "c": "0x538bf8dbeaaaff652d564afe07733ea37c07adf360174a700330a1e4f1c6030b589f8f49709d6d626a822ce2bcb020bfde05c2ad11dd1bf7107088af967be4a4"
    }
}`;

const INVALID_PROOF_JSON = `{
    "curve": "Bn254",
    "proof": {
        "a": "0x976e8831975ade909192a185fb553f7f66d7ff0b58b2ac69e63635632213011f2fad7e996a95ecdbdf251a2526c7c856f894035765fd8c6e6ebde0bd25f9660d",
        "b": "0x5bc1574562bdb6279caa6e0fe6c228aea9b4ed14d7411f080e5a365d86c30c1901a3f19010881db71db8d73af7ffb80303455625bbd34a8e7e3e3a2d2e194324a86a07c4faf9ba2d96c52af5dc265958b2a9d98823461828fa9d0a65d3830f19fee8146afff5565b27514ab317b08647624a49804081542994ebd7b6e6b20d14",
        "c": "0x538bf8dbeaaaff652d564afe07733ea37c07adf360174a700330a1e4f1c6030b589f8f49709d6d626a822ce2bcb020bfde05c2ad11dd1bf7107088af967be4a4"
    }
}`;

const PUBS_JSON = `["0xa75d1fe3e7eb2f0bd2d88886c679582b85a74ee4a6b77b2d07617b85089da420"]`;

const VKEY_JSON = `{
    "curve": "Bn254",
    "alphaG1": "0xf23ecc6fdae0957b6f9901baa097ec1192a97795a65ef10147345343eb4901183096f9296b8d74135878afea791ad1e053c33460fefb392c61925bb086a3dda5",
    "betaG2": "0xa17eb8514763a6f1bb824ee9da47097c8529e799f026f544e8e5bdb565f027007313fe210c046dca53e3ecbe79fe12a6dcbadec7e6e370854c49c7768a9088091512d8f91c6c6f2e78b0438ecb511fbd63e0235534d09a0b1643222d841a130cd3b32b17890c6e832aca76c4e28cb31cab8876cf0550881d115edaa9e39da4ad",
    "gammaG2": "0xc57b18d336c2bfd4693a08c7ad91d82c9bc761f569273f15d0b3d3b341f0e11cdf8728fb8d2375eeba14f081b7ed4cb67f7c10197ea90cbb5012bfb8ee820001485d3dd137e7baf0594b73c7b954fa60f0bf5344299d80349ad3a44e2fef962365a8188bf3e4b3769246ef2fb123c5354e868ed667953f513ff72d042678cd02",
    "deltaG2": "0x66bdd7020e111de2367423d630c6b046a1d23ef4aa4983f4476d87bf705b4328ffe5147b93264bf90e0ed74585f43910b43bf0188d86cbd236ea687d0ff7e22d3f2f288e408e98937c1febcbe43874c5ce465bde5cbd6e9628138c26a656dd222d493505af528ff9e12dcd0bbdefa5c97fb502440cfa097045abef314456050a",
    "gammaAbcG1": [
        "0x2c3c89c560512b2d0b08da1e848f41d6ca559d1b58df315625e95ab0310e3b0f4976fe82316d238aa35b63cdff2f0ef108b9d76c6b45f1eb57dbdfcbe663dc9d",
        "0x254fe8f76591c219562ede7a5807212abc9427bdb012a9145fe48fe49077711d36bef432122d026d20ed95a2c1e3d7f0c63e6349e112d6786722f40fa6589811"
    ]
}`;

const PROOF: Proof = JSON.parse(PROOF_JSON);
const INVALID_PROOF: Proof = JSON.parse(INVALID_PROOF_JSON);
const PUBS: string[] = JSON.parse(PUBS_JSON);
const VK: VerificationKey = JSON.parse(VKEY_JSON);

export const groth16ProofData: ProofData = {
    proof: PROOF,
    invalid_proof: INVALID_PROOF,
    pubs: PUBS,
    vk: VK
};