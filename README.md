# blockchain-save-data
Form to save/fetch file on IPFS storage, and hash on ethereum blockchain. Blockchain simulated using ethereumjs testrpc.<br />

1. Install [testrpc v3.0.5](https://github.com/shivamdawer/testrpc)
2. Clone repository on localhost with PHP installed
3. `npm install -g truffle@2.1.2` (Install truffle v2)
4. In terminal 1, `testrpc -l 10000000000` (High gas limit),<br> or `geth --unlock=<address> --rpc --rpccorsdomain = "*" --rpcport="8545" console` (Explained below)
5. In terminal 2, start IPFS daemon
6. In terminal 3, `npm init`
7. In terminal 3, `cd blockchain-save-data && truffle migrate && truffle build` (Open clone, compile contracts and scripts)

## TESTRPC
A Node.js based Ethereum client for testing and development, testrpc is written in javascript. By default, it simulates 10 ethereum accounts on localhost at port 8545. 
<br><br>
It is also possible to use a local ethereum node using geth. Set up with one or more accounts unlocked (e.g, `--unlock 0`), RPC enabled (`--rpc`) and the proper RPC CORS set up (e.g, `--rpccorsdomain = "*"`)
<br>
Check out [this guide](https://github.com/ledgerlabs/ethereum-getting-started/wiki/local-node) if you want to run a local Ethereum node.
<br>
Create account using 
```SHELL
$ geth account new
```
Create node using custom genesis file
```SHELL
$ geth init /full/path/to/CustomGenesis.json
$ geth --unlock=<address> --rpc --rpccorsdomain = "*" --rpcport="8545" console
```

## Localhost
Generally, truffle creates a server using `truffle serve` (default port: 8080). However, this does not supprt PHP. Hence, project should be cloned in root of localhost (LAMP or XAMPP). This can be accessed using following url : `http://localhost/blockchain-save-data/build/`

### Local IPFS node

First, [install IPFS](https://ipfs.io/docs/install/) on your machine.
<br /><br />
I suggest you don't override the IPFS directory associated to your localhost's user 
(normally at `~/.ipfs`), so the first thing you want to do is set up an IPFS directory 
specific for development. You can define one under the current project's root, after 
you check out this repo:

```SHELL
$ export IPFS_PATH=.ipfs
$ ipfs init
```

After that, you need to loosen your IPFS node's CORS restrictions:

```SHELL
$ ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
$ ipfs config --json Gateway.HTTPHeaders.Access-Control-Allow-Origin '["*"]'
```

You can now start the IPFS daemon:

`$ ipfs daemon`
