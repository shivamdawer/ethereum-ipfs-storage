pragma solidity ^0.4.2;

contract OwnerFile {
  address public accountant;
  mapping (bytes4 => uint) emailIdMap;
  uint public autoIncrement;

  // so you can log these events
  event Search(bytes4 _email);
  event Delete(bytes4 _email);
  event Record(uint _id, bool _newEntry);

  function OwnerFile() {
    accountant = msg.sender;
    autoIncrement = 0;
  }

  function setId(uint id, bytes4 email) public payable {
    if (msg.sender != accountant ) { return; }

    emailIdMap[email] = id;
  }

  function checkIdExists(bytes4 email) constant public returns (bool success) {
      Search(email);
      uint id = emailIdMap[email];
      if(id == uint(0x0)) {
        return false;
      }
      return true;
  }

  function fetchId(bytes4 email) constant public returns (uint id) {
      if (msg.sender != accountant ) { return 0; }

      Search(email);
      return emailIdMap[email];
  }

  function createId(bytes4 email) constant returns (uint) {
    if (msg.sender != accountant) { return; }
    
    uint id = emailIdMap[email];
    if(id == uint(0x0)) {
      autoIncrement++;
      id = autoIncrement;
      emailIdMap[email] = id;
      Record(id, true);
    } else {
      Record(id, false);
    }

    return id;
  }

  function deleteRecord(bytes4 email) public {
      if (msg.sender != accountant) { return; }
      if(checkIdExists(email) == true) {
        Delete(email);
        delete emailIdMap[email];
      }
  }

  function destroy() { // so funds not locked in contract forever
      if (msg.sender == accountant) { 
        suicide(accountant); // send funds to accountant
      }
    }
}