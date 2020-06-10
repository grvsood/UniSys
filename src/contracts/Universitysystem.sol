pragma solidity >=0.4.20;
pragma experimental ABIEncoderV2;
contract Universitysystem {
  string name;
  address public owner;
  uint public transferCount = 0;
  struct Transfer{
    address contract_;
    address to_;
    uint amount_;
    bool failed_;
  }

  struct Request{
    address by_;
    string stdname;
    string rollno;
    string branch;
    string to_;
    string[] lastapproved;
    string subject;
    string briefdesc;
    address[] lastapprovedadd;
    uint count;
    bool finalised;
    string status;
    // string notes;
    // string reason;
    uint timestampbegin;
    uint timestampend;
  }
  uint public reqcounter = 1;
  mapping(uint => Request) public reqmap;
  function getterreq() external view returns(uint){
    return reqcounter;
  }
  function requestResponse(uint id,string memory by_, string memory stat, string memory reason, string memory notes,string memory transferto_) public {
    Request storage req = reqmap[id];
    if(keccak256(abi.encodePacked((stat))) == keccak256(abi.encodePacked(("accept")))){
      req.finalised = true;
      req.lastapproved.push(by_);
      req.lastapprovedadd.push(msg.sender);
      req.count = req.count +1;
      req.status = "accept";
      // req.notes = notes;
      // req.reason = reason;
      req.timestampend = now;
    }
    if(keccak256(abi.encodePacked((stat))) == keccak256(abi.encodePacked(("reject")))){
      req.finalised = true;
      req.lastapproved.push(by_);
      req.lastapprovedadd.push(msg.sender);
      req.count = req.count +1;
      req.status = "reject";
      // req.notes = notes;
      // req.reason = reason;
      req.timestampend = now;
    }
    if(keccak256(abi.encodePacked((stat))) == keccak256(abi.encodePacked(("transfer")))){
      req.finalised = false;
      req.lastapproved.push(by_);
      req.lastapprovedadd.push(msg.sender);
      req.count = req.count +1;
      req.status = "transfer";
      // req.notes = notes;
      // req.reason = reason;
      req.to_ = transferto_;
      req.timestampend = now;
    }
  }
  event RequestCreated(address by_, bool success);
  function createRequest(string memory stdname,string memory rollno,string memory branch, string  memory sub, string  memory desc,string memory to_) public {
    Request memory newReq;
    newReq.by_ = msg.sender;
    newReq.stdname = stdname;
    newReq.rollno = rollno;
    newReq.branch = branch;
    newReq.count = 0;
    newReq.to_ = to_;
    newReq.status = "created";
    newReq.subject = sub;
    newReq.briefdesc = desc;
    newReq.finalised = false;
    newReq.timestampbegin = now;
    newReq.timestampend = now;
    reqmap[reqcounter]  = newReq;
    reqcounter ++;
    emit RequestCreated(msg.sender, true);
  }

  function viewRequest(uint id) public view  returns (string memory stdname, string memory rollno, string memory branch, string memory to_,string[] memory lastapproved, string memory subject, string memory briefdesc, address[] memory lastapprovedadd, bool finalised, string memory status, uint, uint ) {
    Request storage req = reqmap[id];
    return (
      req.stdname,
      req.rollno,
      req.branch,
      req.to_,
      req.lastapproved,
      req.subject,
      req.briefdesc,
      req.lastapprovedadd,
      req.finalised,
      req.status,
      // req.notes,
      // req.reason
      req.timestampbegin,
      req.timestampend
    );
  }

  mapping(address => uint[]) public transactionIndexesToSender;
  Transfer[] public transactions;

  function getTransactions() public view returns (Transfer[] memory) {
        uint[] storage len = transactionIndexesToSender[msg.sender];
        Transfer[] memory result = new Transfer[](len.length);
        for(uint i = 0 ; i < len.length ; i++ ) result[i] = transactions[len[i]];
        return result;
  }
  event TransferSuccessful(address payable from_, address payable to_, uint256 amount_, bool success);
  event TransferFailed(address payable from_, address payable to_, uint256 amount_, bool success);
  constructor() public {
     name = "University Transaction System";
     owner = msg.sender;
  }
  address payable to = address(uint160(0xcF01971DB0CAB2CBeE4A8C21BB7638aC1FA1c38c));
  function payFees() public payable {
      address(to).transfer(msg.value);
  }



  // Document Verification
  struct MyNotaryEntry {
        string fileName;
        uint timestamp;
        bytes32 checkSum;
        string comments;
        bool isSet;
        address setBy;
    }

    mapping (bytes32 => MyNotaryEntry) public myMapping;

    event NewEntry(bytes32 _checksum, string _filename, address indexed _setBy);

    /**
     * Example: 0x193C167E2B336B32356F17009C923C4CD33AC8E3F62BAD1384E8A049F77FD295, "test", "test"
     * */
    function addEntry(bytes32 _checksum, string memory _fileName, string memory _comments) public {
        require(!myMapping[_checksum].isSet);
        require(msg.sender == owner);
        myMapping[_checksum].isSet = true;
        myMapping[_checksum].fileName = _fileName;
        myMapping[_checksum].timestamp = now;
        myMapping[_checksum].comments = _comments;
        myMapping[_checksum].setBy = msg.sender;

        emit NewEntry(_checksum, _fileName, msg.sender);
    }


    function entrySet(bytes32 _checksum) public view returns(string memory, uint, string memory, address) {
        require(myMapping[_checksum].isSet);
        return (myMapping[_checksum].fileName, myMapping[_checksum].timestamp, myMapping[_checksum].comments, myMapping[_checksum].setBy);
    }

}
