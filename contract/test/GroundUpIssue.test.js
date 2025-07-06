const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('GroundUpIssue', function () {
  let GroundUpIssue;
  let groundUpIssue;
  let owner;
  let addr1;
  let addr2;

  // Before each test, deploy a new contract
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    GroundUpIssue = await ethers.getContractFactory('GroundUpIssue');
    groundUpIssue = await GroundUpIssue.deploy();
    await groundUpIssue.waitForDeployment(); // Wait for the contract to be deployed
  });

  describe('Deployment', function () {
    it('Should set the correct initial nextIssueId', async function () {
      expect(await groundUpIssue.nextIssueId()).to.equal(0);
    });
  });

  describe('reportIssue', function () {
    it('Should allow a user to report an issue and emit an event', async function () {
      const dataHash = ethers.keccak256(
        ethers.toUtf8Bytes('pothole_image_hash_123')
      ); // Example hash
      const reporterAddress = addr1.address;

      // Connect with addr1 to simulate reporting from a user
      await expect(groundUpIssue.connect(addr1).reportIssue(dataHash))
        .to.emit(groundUpIssue, 'IssueReported')
        .withArgs(
          0,
          reporterAddress,
          dataHash,
          (
            await ethers.provider.getBlock('latest')
          ).timestamp
        );

      // Verify that nextIssueId has incremented
      expect(await groundUpIssue.nextIssueId()).to.equal(1);

      // Verify the stored issue details (using the public 'issues' mapping getter)
      const reportedIssue = await groundUpIssue.issues(0);
      expect(reportedIssue.reporterAddress).to.equal(reporterAddress);
      expect(reportedIssue.dataHash).to.equal(dataHash);
      expect(reportedIssue.timestamp).to.be.closeTo(
        (await ethers.provider.getBlock('latest')).timestamp,
        5
      ); // Allow for slight time difference
    });

    it('Should increment issueId for subsequent reports', async function () {
      const dataHash1 = ethers.keccak256(ethers.toUtf8Bytes('hash1'));
      const dataHash2 = ethers.keccak256(ethers.toUtf8Bytes('hash2'));

      await groundUpIssue.connect(addr1).reportIssue(dataHash1);
      await groundUpIssue.connect(addr2).reportIssue(dataHash2);

      expect(await groundUpIssue.nextIssueId()).to.equal(2);

      const issue0 = await groundUpIssue.issues(0);
      expect(issue0.dataHash).to.equal(dataHash1);
      expect(issue0.reporterAddress).to.equal(addr1.address);

      const issue1 = await groundUpIssue.issues(1);
      expect(issue1.dataHash).to.equal(dataHash2);
      expect(issue1.reporterAddress).to.equal(addr2.address);
    });
  });
});
