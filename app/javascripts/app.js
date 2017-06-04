var accounts;
var account;

function setStatus(message) {
  var status = document.getElementById("status");
  status.innerHTML = message;
};

function updateElement(id, value) {
  var ele = document.getElementById(id);
  ele.innerHTML = value;
}

window.onload = function() {
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
}

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