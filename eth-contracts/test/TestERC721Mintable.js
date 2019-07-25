var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('CustomERC721Token', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];
    const account_four = accounts[3];
    const account_five = accounts[4];
    const account_six = accounts[5];

    describe('match erc721 spec', function () {
        beforeEach(async function () {
          //console.log(account_one);
            this.contract = await CustomERC721Token.new({from: account_one});
            await this.contract.mint(account_one,1,{from: account_one});
            await this.contract.mint(account_two,2,{from: account_one});
            await this.contract.mint(account_three,3,{from: account_one});
            await this.contract.mint(account_four,4,{from: account_one});
            await this.contract.mint(account_five,5,{from: account_one});
            await this.contract.mint(account_six,6,{from: account_one});
            //await this.contract.mint(account_one,1,{from: account_one});
          //  await this.contract.mint(account_two,4,{from: account_two});
            let token_owner_one = await this.contract.ownerOf.call(1, {from: account_one});
            //console.log(token_owner_one);
            //let token_owner_two = await this.contract.ownerOf.call(4,{from: account_two});

            //assert.equal(token_owner_one,account_one,"Owner not matching first account");
            //assert.equal(token_owner_two,account_two,"Owner not matching second account");


            // TODO: mint multiple tokens
        })

        it('should return total supply', async function () {
          let supply = await this.contract.totalSupply.call();
          //console.log(supply);
          assert.equal(supply,6,"Supply should be 10 at this point.");

        })

        it('should get token balance', async function () {
          let balance = await this.contract.balanceOf.call(account_one);
          assert.equal(balance.toNumber(),1,"Balance should be 1 for this account.");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
          let tokenURI = await this.contract.tokenURI.call(1);
          assert.equal(tokenURI,"https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1","URI does not match.")
        })

        it('should transfer token from one owner to another', async function () {
          await this.contract.transferFrom(account_one,account_two,1);
          let owner = await this.contract.ownerOf.call(1);
          assert.equal(owner,account_two,"Ownership didnt transferred.");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await CustomERC721Token.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {
          let exception = false;
          try{
                await this.contract.mint(account_two,7,{from: account_two});
          }catch(e){
                exception = true;
          }
          assert.equal(exception,true,"Minting without contract owner.");
        })

        it('should return contract owner', async function () {
          let contract_owner = await this.contract.getOwner.call({from:account_one});
          assert.equal(contract_owner,account_one,"Contract owner does not match.")
        })

    });
})
