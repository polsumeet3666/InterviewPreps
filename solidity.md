# online ide
	https://remix.ethereum.org/

# sample code
```
	// import solidity ^0.4.0;
	pragma solidity ^0.4.0;

	// import
	import "filename";
	import * as symbolname from "filename";
	import {symbol as alias,symbol2} from "filename";

	// first contract
	contract SimpleContract {
		// contract code here

		//state variable
		uint storedData;

		// modifier is conditional and its run before function is called
		modifier onlyData(){
			require(
				storedData >= 0);
				_;  // syntax to close modifier
		}

		// function
		function set(unit x) public{
			storedData = x;
		}

		//events
		event Sent(address from,address to,unit storedData);
	}


```

# Data Types
```
// import solidity
pragma solidity ^0.4.7;

// string
string name = "sample";

//uint
uint storedata = 34;

//boolean
bool flag = false;

//address
address walletAddress = 0x72ac232312;

// array
string[] days;

//bytes32
bytes32 code;

// struct
struct User{
    string firstname;
    string lastname;
}

// enum
enum userType {buyer,seller};

// mapping
mapping(address => uint) public balance;
```

# Units and global variables

```
// import solidity
pragma solidity ^0.4.7;

// units and global variables
contract SimpleContract {
    // below are global variables
    // ether finney szabo
    
    bool isEqual = (1 ether == 5000 finney);
    
    // time units
    // seconds, minutes, hours, weeks 
    // years is depericated 
    bool isTime = (1 hours == 60 minutes);
}
```

# Other special variables
```
// import solidity
pragma solidity ^0.4.7;

//other special variables
contract SimpleContract {

    // single line comment
    
    /* mulitple line commet here
    and here*/

    // blocks 
    block.number;
    block.difficulty;
    block.coinbase(); // miner adder
    
    // message
    msg.sender;
    msg.value;
    msg.data;  // metadata
    
    // transaction
    tx.origin;
}
```

# functions overview
```
// import solidity
pragma solidity ^0.4.7;

// function overview
contract SimpleContract {
    
    // public function can be access outside of contract
    // pure to specify that function is just pure function
    // returns can return multiple return values
    // private function can be access only within contract
    
    
    function calc(uint _a,uint _b) public pure
    returns (o_sum,o_product) {
        o_sum = _a + _b;
        o_product = _a * _b;
    }
}
```

# Operators in solidity
```
// import solidity
pragma solidity ^0.4.7;

// operators overview
contract SimpleContract {
 
 // Arithmatic operators
 // + - * / **
 // ** - exponential
 
 uint a = 2;
 uint b = 3;
 uint c = a ** b;  // c = 8
 
 // Logical operators
 // ! && || != == 
 bool hasMoney = !false;
 
 // Bitwise operators
 // ! & ^ ~ >> <<
 bytes1 a = 0x02 | 0x01;
}
```

# Conditionals in solidity
 only switch is not avalible
```
// import solidity
pragma solidity ^0.4.7;

// operators overview
contract SimpleContract {
    
    // if statement
    if (a == 2) {
        // code 1 
    }
    else {
        // code 2 
    }
    
    // while loop
    while(a < 10 ){
        // code 3 
    }
    
    // do-while loop
    do {
        // code 4
    }while (a >10);
    
    // for loop
    for(uint i=0;i<10;i++){
        // code 5 
    }

}
```

# First Contract
```
// import solidity
pragma solidity ^0.4.7;

// Inheitance
contract Inheitance {
    
    // variable
    address owner;
    bool deceased;
    uint money;
    
    // constructor
    constructor() public payable {
        owner = msg.sender;
        money = msg.value;
        deceased = false ; // inital value is false
    }
    
    // modifiers
    modifier oneOwner() {
        require(owner == msg.sender);
        _;  // syntax to end modifier
    }
    
    modifier isDecesed() {
        require(deceased == true);
        _;
    }
    
    
    address[] wallets;
    
    // mapping
    mapping(address => uint) inheritances;
    
    function setup(address _wallet,uint _inheritance) public oneOwner{
        wallets.push(_wallet);
        inheritances[_wallet] = _inheritance;
    }
    
    function moneyPaid() private isDecesed {
        for(uint i=0;i<wallets.length;i++) {
            wallets[i].transfer(inheritances[wallets[i]]);    
        }
    }
    
    function dead() public oneOwner{
        deceased = true;
        moneyPaid();
    }

}
```