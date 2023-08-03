import { ethers } from 'hardhat';
import { expect } from 'chai';
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { merkelRootArray } from '../scripts/merkel-root';
import { obtainProof } from '../scripts/obtain-proof';

describe("Undercover Contract", function () {

    async function deployUCFixture() {
        // Contracts are deployed using the first signer/account by default
        const [owner, addr1, addr2, otherAccount] = await ethers.getSigners();
        const ownerAddr = await owner.getAddress();
        const Undercover = await ethers.getContractFactory("Undercover", owner);
        const UC = await ethers.getContractFactory("UC", owner);
        const addrArray = [addr1.address, addr2.address];
        const merkelArray = [[addr1.address, 5000], [addr2.address, 5000]];
        const root = await merkelRootArray(merkelArray);
        const supply = 1000000000;
        const uc = await UC.deploy(supply);
        const undercover = await Undercover.deploy(root, uc.getAddress());
        const erc20 = await uc.getAddress();
        // await uc.approve(await undercover.getAddress(), supply);
        await uc.transfer(undercover.getAddress(), 500000000);
        return { uc, undercover, addr1, addr2, addrArray, supply, root, erc20, ownerAddr, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right token", async function () {
            const { uc, supply } = await loadFixture(deployUCFixture);
            expect(await uc.totalSupply()).to.equal(supply);
        });

        it("Should mint the right amount to owner", async function () {
            const { uc, ownerAddr } = await loadFixture(deployUCFixture);
            expect(await uc.balanceOf(ownerAddr)).to.equal(500000000);
        });

        it("Should set the right owner", async function () {
            const { undercover, ownerAddr } = await loadFixture(deployUCFixture);

            expect(await undercover.owner()).to.equal(ownerAddr);
        });

        it("Should set the right root", async function () {
            const { undercover, root } = await loadFixture(deployUCFixture);

            expect(await undercover.merkleRoot()).to.equal(root);
            // expect(await undercover.token()).to.equal(uc.getAddress());
        });
    });


    describe("Claim function", function () {
        it("Should claim tokens", async function () {

            const { undercover, addr1,  uc } = await loadFixture(deployUCFixture);


            const proofOfAddr1 = await obtainProof(addr1.address);
            await undercover.connect(addr1).claim(proofOfAddr1, 5000);

            expect(await uc.balanceOf(addr1)).to.equal(5000);
        });
    });
});
