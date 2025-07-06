const hre = require('hardhat');

async function main() {
  // Ensure you have deployed the contract and have its address.
  // You might load it from a deployments file or hardcode it for testing.
  const contractAddress = 'YOUR_DEPLOYED_CONTRACT_ADDRESS_ON_TESTNET'; // Replace with actual address

  // Get the signer (your account with testnet FLR/SGB)
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Using account: ${deployer.address}`);

  // Get the contract instance
  const GroundUpIssue = await hre.ethers.getContractFactory('GroundUpIssue');
  const groundUpIssue = await GroundUpIssue.attach(contractAddress);

  console.log(
    `Interacting with GroundUpIssue contract at: ${groundUpIssue.target}`
  );

  // --- Test Case 1: Report a new issue ---
  console.log('\n--- Reporting a new issue ---');
  const issueType1 = 'Broken Streetlight';
  const latitude1 = 9000000; // Example scaled coordinates
  const longitude1 = 7000000;
  const dataHash1 = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes('streetlight_photo_hash_abc')
  );

  try {
    const tx1 = await groundUpIssue.reportIssue(
      issueType1,
      latitude1,
      longitude1,
      dataHash1
    );
    await tx1.wait();
    console.log(`Transaction for reporting issue 1 sent: ${tx1.hash}`);
    console.log('Issue 1 reported successfully!');
  } catch (error) {
    console.error('Error reporting issue 1:', error.message);
  }

  // --- Test Case 2: Get the reported issue ---
  console.log('\n--- Retrieving issue 0 ---');
  try {
    const issue0 = await groundUpIssue.getIssue(0);
    console.log('Retrieved Issue 0 details:');
    console.log(`  Issue ID: ${issue0.issueId}`);
    console.log(`  Reporter: ${issue0.reporterAddress}`);
    console.log(`  Type: ${issue0.issueType}`);
    console.log(`  Lat: ${issue0.latitude}, Lon: ${issue0.longitude}`);
    console.log(`  Data Hash: ${issue0.dataHash}`);
    console.log(`  Timestamp: ${new Date(Number(issue0.timestamp) * 1000)}`);
    console.log(`  Status: ${issue0.status}`); // Enum value (0 for Pending)
    console.log(`  Upvotes: ${issue0.upvotes}`);
  } catch (error) {
    console.error('Error retrieving issue 0:', error.message);
  }

  // --- Test Case 3: Report another issue from a different account ---
  console.log('\n--- Reporting another issue from addr1 ---');
  const issueType2 = 'Pothole';
  const latitude2 = 8500000;
  const longitude2 = 6500000;
  const dataHash2 = hre.ethers.keccak256(
    hre.ethers.toUtf8Bytes('pothole_video_hash_xyz')
  );

  try {
    const tx2 = await groundUpIssue
      .connect(deployer)
      .reportIssue(issueType2, latitude2, longitude2, dataHash2);
    await tx2.wait();
    console.log(`Transaction for reporting issue 2 sent: ${tx2.hash}`);
    console.log('Issue 2 reported successfully!');
  } catch (error) {
    console.error('Error reporting issue 2:', error.message);
  }

  // --- Test Case 4: Try to get a non-existent issue ---
  console.log('\n--- Trying to retrieve non-existent issue 10 ---');
  try {
    await groundUpIssue.getIssue(10);
    console.log('Unexpected: Retrieved issue 10 (should have failed)');
  } catch (error) {
    console.error('Expected error for non-existent issue:', error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
