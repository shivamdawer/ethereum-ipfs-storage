module.exports = function(deployer) {
  deployer.deploy(HrSolution, {gas: 4400000});
  deployer.deploy(OwnerFile, {gas: 4400000});
};
