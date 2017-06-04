pragma solidity ^0.4.2;

import "OwnerFile.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract HrSolution is OwnerFile {
	struct Entry {
	    bytes4 name;
	    bytes4 email;
	    bytes4 phone;
	    bytes4 company;
	}

	mapping (uint => Entry) entries;
	mapping (address => uint) balances;

	function addRecord(bytes4 name, bytes4 email, bytes4 phone, bytes4 company) payable {
    if (msg.sender != accountant) { return; }

    uint id = OwnerFile.createId(email);

    Entry memory record;
    record.name = name;
    record.email = email;
    record.phone = phone;
    record.company = company;

    entries[id] = record;
  }

  function fetchRecord(uint id) constant returns (bytes4 n, bytes4 e, bytes4 p, bytes4 c) {
    if (msg.sender != accountant) { return; }

    if(id == 0) return;
    Entry record = entries[id];
    return (record.name, record.email, record.phone, record.company);
    // n = bytes4(record.name);
    // e = bytes4(record.email);
    // p = bytes4(record.phone);
    // c = bytes4(record.company);
  }
}
