pragma solidity ^0.4.2;

contract HrSolution {
    address public accountant;
    mapping (bytes => bytes) emailHashMap;

    function HrSolution() {
        accountant = msg.sender;
    }

	function addRecord(bytes hash, bytes email) public payable {
        if (msg.sender != accountant) { return; }
        emailHashMap[email] = hash;
    }

    function checkRecord(bytes email) returns (bool) {
        bytes hash = emailHashMap[email];
        if(sha3(hash) == sha3('')) {
            return false;
        }
        return true;
    }

    function fetchRecord(bytes email) returns (bytes) {
        if (msg.sender != accountant) { return; }
        return emailHashMap[email];
    }

    function deleteRecord(bytes email) public {
        if (msg.sender != accountant) { return; }
        // bytes hash = emailHashMap[email];
        // if(hash != 0x0) {
        delete emailHashMap[email];
        // }
    }

    function destroy() { // so funds not locked in contract forever
        if (msg.sender == accountant) { 
            suicide(accountant); // send funds to accountant
        }
    }
}
