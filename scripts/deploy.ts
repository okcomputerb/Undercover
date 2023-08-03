import { ethers } from "hardhat";

async function main() {

  const faucet = await ethers.deployContract("Faucet", [
    "0x23eecd8030d25cfb40be2e6d049a088bcd6362e645b6749257477fcfadb8af1e"
  ]);

  await faucet.waitForDeployment();

  console.log(
    `deployed at ${faucet.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
