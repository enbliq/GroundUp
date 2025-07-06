const hre = require('hardhat');

async function main() {
  const GroundUpIssue = await hre.ethers.getContractFactory('GroundUpIssue');

  console.log('Deploying GroundUpIssue contract...');

  const groundUpIssue = await GroundUpIssue.deploy();

  await groundUpIssue.waitForDeployment();

  console.log(`GroundUpIssue contract deployed to: ${groundUpIssue.target}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
