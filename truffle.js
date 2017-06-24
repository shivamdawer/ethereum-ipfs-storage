module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js",
    ],
    "ipfs.js": [
      "javascripts/ipfs.js",
    ],
    "web3.min.js": [
      "javascripts/web3.min.js",
    ],
    "jquery-3.2.1.min.js": [
      "javascripts/jquery-3.2.1.min.js",
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/",
    "php/": "php/"
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
