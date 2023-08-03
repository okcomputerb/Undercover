const fs = require('fs');
const { parse } = require('csv-parse/sync');
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

export async function merkelRoot(filePath: string) {
  // Read the CSV file
  const data = fs.readFileSync(filePath, 'utf-8');

  // Parse the CSV data
  const records = parse(data, {
    columns: true,
    skip_empty_lines: true
  });

  // Create the leaves of the Merkle tree
  const leaves = records.map((record: { address: any; amount: any; }) => [record.address, record.amount]);

  const tree = StandardMerkleTree.of(leaves, ["address", "uint256"]);

  console.log('Merkle Root:', tree.root);

  fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));

  return tree.root;
}

export async function merkelRootArray(leaves: any[][]) {

  // Create the leaves of the Merkle tree
  const tree = StandardMerkleTree.of(leaves, ["address", "uint256"]);

  console.log('Merkle Root:', tree.root);

  fs.writeFileSync("tree.json", JSON.stringify(tree.dump()));

  return tree.root;
}

export async function merkelAddress(filePath: string) {
  // Read the CSV file
  const data = fs.readFileSync(filePath, 'utf-8');

  // Parse the CSV data
  const records = parse(data, {
    columns: true,
    skip_empty_lines: true
  });

  // Create the leaves of the Merkle tree
  return records.map((record: { address: any; amount: any; }) => [record.address, record.amount]);
}
