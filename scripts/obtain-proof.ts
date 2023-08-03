import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import fs from "fs";

export async function obtainProof(address: string) {
    const tree = StandardMerkleTree.load(JSON.parse(fs.readFileSync("tree.json").toString()));
    var proof: string[] = [];
    for (const [i, v] of tree.entries()) {
        if (v[0] === address) {
            // (3)
            proof = tree.getProof(i);
            console.log('Value:', v);
            console.log('Proof:', proof);
        }
    }
    return proof;
}

export default obtainProof;
