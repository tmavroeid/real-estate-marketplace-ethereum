pragma solidity >=0.4.21 <0.6.0;
import "openzeppelin-solidity/contracts/utils/Address.sol";
import "./ERC721Mintable.sol";
import "./Verifier.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier{

}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token{
  struct solution{
    uint256 tokenId;
    address owner;
  }
  solution[] solutionsArray; // the elements of this array are structs of type solutions
  // solutionArray.push(Solution(<tokenId>, <owner>))
  mapping (bytes32 => solution) internal solutions;

  event SolutionAdded(uint256 tokenId, address owner);



SquareVerifier public verifier_;

constructor( address verifierAddress) public {
  verifier_ = SquareVerifier(verifierAddress);
}

function getVerifierKey(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input) pure public returns(bytes32) {
  return keccak256(abi.encodePacked(a, b, c, input));
}

function addSolution(uint256 _tokenId, address _owner, bytes32 _key) public {
   solution memory sol = solution({tokenId:_tokenId,owner:_owner});
   solutionsArray.push(sol);

   solution storage soln = solutions[_key];
   soln.tokenId = _tokenId;
   soln.owner = _owner;

   emit SolutionAdded(_tokenId, _owner);
 }

 function mintToken(address to, uint256 tokenId, uint[2] memory a,
             uint[2][2] memory b, uint[2] memory c, uint[2] memory input)
             public
 {
     bytes32 key = this.getVerifierKey(a, b, c, input);
     require(solutions[key].owner == address(0), "Solution must be unique to mint a token.");
     require(verifier_.verifyTx(a,b,c,input), "Solution isnt correct.");
     addSolution(tokenId, to, key);
     mint(to, tokenId);
 }
}
// TODO define a solutions struct that can hold an index & an address


// TODO define an array of the above struct


// TODO define a mapping to store unique solutions submitted



// TODO Create an event to emit when a solution is added



// TODO Create a function to add the solutions to the array and emit the event



// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
