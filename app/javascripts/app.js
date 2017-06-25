var accounts;
var account;
var ipfs;
var ipfsDataHost;

window.onload = function() {
  // web3
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];
  });

  // IPFS
  var ipfsHost    = 'localhost',
      ipfsAPIPort = '5001',
      ipfsWebPort = '8080';
  ipfs = IpfsApi(ipfsHost, ipfsAPIPort)
  ipfs.swarm.peers(function(err, response) {
      if (err) {
          console.error(err);
      } else {
          console.log("IPFS - connected to " + response.Peers.length + " peers");
          console.log(response);
      }
  });
  ipfsDataHost = "http://" + ipfsHost + ':' + ipfsWebPort + "/ipfs";
  window.ipfs = ipfs
}

function loadFile(e) {
  var reader = new FileReader();
  reader.onload = function() {
    var id = document.getElementById("file");
    if(id.files && id.files[0]) {
      var filename = id.files[0]['name']
      console.log('Data - ' + decode_base64(reader.result.substr(13)))
      addDataToIPFS(reader.result, filename)
    }
  };
  reader.readAsDataURL(e.target.files[0]);
}

function addRecord() {
  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var company = document.getElementById("company").value;

  if(email == "") {
    updateElement("status", "Email field cannot be empty!");
    return;
  }

  var data = {
              'name': name,
              'email': email,
              'phone': phone,
              'company': company
            };
  updateElement("status", "Initiating transaction... (please wait)");
  addDataToIPFS(data, generateRandomString(), true);
}

function searchRecord() {
  var email = document.getElementById("search-email").value;
  
  if(email == "") {
    updateElement("status", "Email field cannot be empty!");
    return;
  }

  updateElement("status", "Initiating search... (please wait)");
  var hr = HrSolution.deployed();
  updateElement("bold-name", "");
  updateElement("show-name", "");
  updateElement("bold-email", "");
  updateElement("show-email", "");
  updateElement("bold-phone", "");
  updateElement("show-phone", "");
  updateElement("bold-company", "");
  updateElement("show-company", "");
  hr.checkRecord.call(email).then(function(flag) {
    flag = flag.valueOf()
    console.log(flag)
    if(flag == true) {
      hr.fetchRecord.call(email, {from: account}).then(function(record) {
        console.log(email, record.valueOf(), web3.toUtf8(record.valueOf()))
        
        var fileHash = web3.toUtf8(record.valueOf())
        var fileURL = ipfsDataHost + "/" + fileHash
        $.get(fileURL, function(output) {
          output = JSON.parse(output);
          updateElement("status", "");
          updateElement("bold-name", "Name: ");
          updateElement("show-name", output.name);
          updateElement("bold-email", "Email: ");
          updateElement("show-email", output.email);
          updateElement("bold-phone", "Phone: ");
          updateElement("show-phone", output.phone);
          updateElement("bold-company", "Company: ");
          updateElement("show-company", output.company);
          console.log(output)
        })
      }).catch(function(e) {
        console.log(e);
        updateElement("status", "Error retrieving record. You are low on ether.");
      });
    } else {
      updateElement("status", "Record not found.");
    }
  }).catch(function(e) {
    console.log(e);
    updateElement("status", "Error checking for record. You are low on ether.");
  });
}

function addDataToIPFS(data, filename, addToBlockchain = false) {
  var url = "./php/senddata.php";
  data = JSON.stringify(data)

  var formdata = {'filename': filename, 'data': data};
  var returnOutput = null;
  $.post(url, formdata, function(output) {
    console.log(output);

    ipfs.add({path: filename, content: data}, function(err, result) {
      if (err) {
          console.error('Error sending file: ', err);
          updateElement("status", "IPFS Failed!");
          return null;
      } else if (result && result[0] && result[0].Hash) {
          var fileURL = ipfsDataHost + "/" + result[0].Hash;
          console.log('File Hash: ', result[0].Hash);
          console.log(fileURL);
          
          if(addToBlockchain == true) {
            var fileHash = result[0].Hash;
            var hr = HrSolution.deployed();
            hr.addRecord(fileHash, email, {from: account}).then(function() {
              updateElement("status", "Transaction complete!");
            }).catch(function(e) {
              console.log(e);
              updateElement("status", "Error adding record. You are low on ether.");
            });
            updateElement("bold-name", "");
            updateElement("show-name", "");
            updateElement("bold-email", "");
            updateElement("show-email", "");
            updateElement("bold-phone", "");
            updateElement("show-phone", "");
            updateElement("bold-company", "");
            updateElement("show-company", "");
          }
      } else {
          console.error('No file for you...');
          updateElement("status", "IPFS Failed!");
          return null;
      }
    });
  });
}

function updateElement(id, value) {
  var ele = document.getElementById(id);
  ele.innerHTML = value;
}

function decode_base64 (s) {
  var e = {}, i, k, v = [], r = '', w = String.fromCharCode;
  var n = [[65, 91], [97, 123], [48, 58], [43, 44], [47, 48]];

  for (z in n) {
    for (i = n[z][0]; i < n[z][1]; i++) {
      v.push(w(i));
    }
  }
  for (i = 0; i < 64; i++) {
    e[v[i]] = i;
  }

  for (i = 0; i < s.length; i+=72) {
    var b = 0, c, x, l = 0, o = s.substring(i, i+72);
    for (x = 0; x < o.length; x++) {
      c = e[o.charAt(x)];
      b = (b << 6) + c;
      l += 6;
      while (l >= 8) {
        r += w((b >>> (l -= 8)) % 256);
      }
    }
  }
  return r;
}

function generateRandomString(length = 10) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for( var i=0; i < length; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}