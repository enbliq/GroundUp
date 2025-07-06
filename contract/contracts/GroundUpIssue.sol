// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GroundUpIssue is Ownable { // Inherit from Ownable
    enum Status { Pending, UnderReview, Resolved, Rejected }

    struct Issue {
        uint256 issueId;
        address reporterAddress;
        string issueType;
        int256 latitude;
        int256 longitude;
        bytes32 dataHash;
        uint256 timestamp;
        Status status;
        uint256 upvotes;
        uint256 commentsCount;
        uint256 latestStatusUpdateTimestamp;
    }

    
    mapping(uint256 => Issue) public issues;
    uint256 public nextIssueId; // Counter for unique issue IDs

    event IssueReported(
        uint256 indexed issueId,
        address indexed reporter,
        string issueType,
        int256 latitude,
        int256 longitude,
        bytes32 dataHash,
        uint256 timestamp
    );

    event StatusUpdated(
        uint256 indexed issueId,
        Status newStatus,
        address indexed updater,
        uint256 timestamp
    );

    event IssueUpvoted(
        uint224 indexed issueId, // Changed to uint224 to allow more indexed events
        address indexed voter,
        uint256 newUpvoteCount
    );

    constructor() Ownable(msg.sender) { // Initialize Ownable with the deployer as owner
        nextIssueId = 0;
    }

    /**
     * @dev Allows a user to report a new infrastructure issue.
     * @param _issueType The category of the issue (e.g., "Pothole", "Streetlight").
     * @param _latitude The scaled latitude of the issue location.
     * @param _longitude The scaled longitude of the issue location.
     * @param _dataHash A cryptographic hash of the off-chain data (e.g., image, detailed description).
     */
    function reportIssue(
        string memory _issueType,
        int256 _latitude,
        int256 _longitude,
        bytes32 _dataHash
    ) public {
        uint256 currentIssueId = nextIssueId;

        issues[currentIssueId] = Issue({
            issueId: currentIssueId,
            reporterAddress: msg.sender,
            issueType: _issueType,
            latitude: _latitude,
            longitude: _longitude,
            dataHash: _dataHash,
            timestamp: block.timestamp,
            status: Status.Pending,
            upvotes: 0,
            commentsCount: 0,
            latestStatusUpdateTimestamp: block.timestamp
        });

        nextIssueId++;

        emit IssueReported(
            currentIssueId,
            msg.sender,
            _issueType,
            _latitude,
            _longitude,
            _dataHash,
            block.timestamp
        );
    }

    /**
     * @dev Retrieves the full details of a specific issue by its ID.
     * @param _issueId The unique ID of the issue to retrieve.
     * @return An Issue struct containing all details of the requested issue.
     */
    function getIssue(uint256 _issueId) public view returns (Issue memory) {
        require(_issueId < nextIssueId, "Issue does not exist");
        return issues[_issueId];
    }

    /**
     * @dev Allows the owner (or authorized address) to update the status of an issue.
     * @param _issueId The ID of the issue to update.
     * @param _newStatus The new status for the issue.
     */
    function updateIssueStatus(uint256 _issueId, Status _newStatus) public onlyOwner {
        require(_issueId < nextIssueId, "Issue does not exist");

        Issue storage issueToUpdate = issues[_issueId];

        require(issueToUpdate.status != _newStatus, "Status is already the same");

        issueToUpdate.status = _newStatus;
        issueToUpdate.latestStatusUpdateTimestamp = block.timestamp;

        emit StatusUpdated(_issueId, _newStatus, msg.sender, block.timestamp);
    }
}