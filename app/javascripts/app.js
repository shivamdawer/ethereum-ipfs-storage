var accounts;
var account;
var ipfs;
var ipfsDataHost;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function updateElement(id, value) {
  var ele = document.getElementById(id);
  ele.innerHTML = value;
}

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
      sendDataToPHP(reader.result, filename)
    }
  };
  reader.readAsDataURL(e.target.files[0]);
}

function sendDataToPHP(data, filename) {
  var url = "./php/senddata.php?filename="+filename+"&data="+JSON.stringify(data);
  $.get(url, function(output) {  
    console.log(output);

    ipfs.add({path: filename, content: data}, function(err, result) {
      if (err) {
          console.error('Error sending file: ', err);
          return null;
      } else if (result && result[0] && result[0].Hash) {
          var fileURL = ipfsDataHost + "/" + result[0].Hash;
          console.log('File Hash: ', result[0].Hash);
          console.log(fileURL);
      } else {
          console.error('No file for you...');
          return null;
      }
    });
  });
}

// function getData() {
//   var hr = HrSolution.deployed();

//   window.contractInstance.get.call(function(err, result){
//       if (err) {
//           console.error('Error getting data: ', err);
//       } else if (result) {
//           var currentIPFSHash = result
//           var imageURL = ipfsDataHost + "/" + result;
//           console.log('File: ', result);
//           console.log(imageURL);
//       } else {
//           console.error('No data. Transaction not mined yet?');
//       }
//   });
// }

function addRecord() {
  var hr = HrSolution.deployed();

  var name = document.getElementById("name").value;
  var email = document.getElementById("email").value;
  var phone = document.getElementById("phone").value;
  var company = document.getElementById("company").value;

  if(email == "") {
    setStatus("Email field cannot be empty!");
    return;
  }

  setStatus("Initiating transaction... (please wait)");
  hr.addRecord(name, email, phone, company, {from: account}).then(function() {
    setStatus("Transaction complete!");
    updateElement("bold-name", "Name: ");
    updateElement("show-name", name);
    updateElement("bold-email", "Email: ");
    updateElement("show-email", email);
    updateElement("bold-phone", "Phone: ");
    updateElement("show-phone", phone);
    updateElement("bold-company", "Company: ");
    updateElement("show-company", company);
  }).catch(function(e) {
    console.log(e);
    setStatus("Error adding record. You are low on ether.");
    updateElement("bold-name", "");
    updateElement("show-name", "");
    updateElement("bold-email", "");
    updateElement("show-email", "");
    updateElement("bold-phone", "");
    updateElement("show-phone", "");
    updateElement("bold-company", "");
    updateElement("show-company", "");
  });
};

function searchRecord() {
  var hr = HrSolution.deployed();

  var email = document.getElementById("search-email").value;
  if(email == "") {
    setStatus("Email field cannot be empty!");
    return;
  }

  setStatus("Initiating transaction... (please wait)");

  hr.fetchId.call(email).then(function(flag) {
    flag = flag.valueOf()
    if(flag == 0) {
      setStatus("Record not found.");
      updateElement("bold-name", "");
      updateElement("show-name", "");
      updateElement("bold-email", "");
      updateElement("show-email", "");
      updateElement("bold-phone", "");
      updateElement("show-phone", "");
      updateElement("bold-company", "");
      updateElement("show-company", "");
    } else {
      hr.fetchRecord.call(flag, {from: account}).then(function(record) {
        console.log(flag, record)        
        setStatus("");
        updateElement("bold-name", "Name: ");
        updateElement("show-name", web3.toUtf8(record[0]));
        updateElement("bold-email", "Email: ");
        updateElement("show-email", web3.toUtf8(record[1]));
        updateElement("bold-phone", "Phone: ");
        updateElement("show-phone", web3.toUtf8(record[2]));
        updateElement("bold-company", "Company: ");
        updateElement("show-company", web3.toUtf8(record[3]));
      }).catch(function(e) {
        console.log(e);
        setStatus("Error retrieving record. You are low on ether.");
        updateElement("bold-name", "");
        updateElement("show-name", "");
        updateElement("bold-email", "");
        updateElement("show-email", "");
        updateElement("bold-phone", "");
        updateElement("show-phone", "");
        updateElement("bold-company", "");
        updateElement("show-company", "");
      });
    }
  }).catch(function(e) {
    setStatus("Error retrieving id. You are low on ether.");
    updateElement("bold-name", "");
    updateElement("show-name", "");
    updateElement("bold-email", "");
    updateElement("show-email", "");
    updateElement("bold-phone", "");
    updateElement("show-phone", "");
    updateElement("bold-company", "");
    updateElement("show-company", "");
  });
};

function decode_base64 (s)
{
    var e = {}, i, k, v = [], r = '', w = String.fromCharCode;
    var n = [[65, 91], [97, 123], [48, 58], [43, 44], [47, 48]];

    for (z in n)
    {
        for (i = n[z][0]; i < n[z][1]; i++)
        {
            v.push(w(i));
        }
    }
    for (i = 0; i < 64; i++)
    {
        e[v[i]] = i;
    }

    for (i = 0; i < s.length; i+=72)
    {
        var b = 0, c, x, l = 0, o = s.substring(i, i+72);
        for (x = 0; x < o.length; x++)
        {
            c = e[o.charAt(x)];
            b = (b << 6) + c;
            l += 6;
            while (l >= 8)
            {
                r += w((b >>> (l -= 8)) % 256);
            }
         }
    }
    return r;
}