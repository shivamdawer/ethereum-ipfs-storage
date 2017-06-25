# ethereum-ipfs-storage (See ipfs branch for data storage)
Form to save/fetch data using ethereum blockchain. Blockchain simulated using ethereumjs testrpc.<br />
Form contains four fields - name,email,phone,company - of which email is primary key.

1. [testrpc v3.0.5](https://github.com/shivamdawer/testrpc)
2. Clone repo
3. `npm install -g truffle@2.1.2` (Install truffle v2)
4. In terminal 1, `testrpc -l 10000000000` (High gas limit)
5. In terminal 2, `cd blockchain-save-data && truffle migrate && truffle serve` (Open clone, compile contracts, launch local server at localhost:8080)

