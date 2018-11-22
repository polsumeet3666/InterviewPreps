var params = {"dataFound":true,"diffInput":{"ldapData":{"ril-profiledata":{"83e5a3f0-bcce-11e8-8297-170e5243088e":""},"ril-profilename":["Pro1-382715374455794871298391537445579489"],"ril-profileowner":"613e0a4b-f3da-4587-843f-c2aa45bd74cc"},"cassandraData":{"ril-profiledata":{"83e11010-bcce-11e8-8297-170e5243088e":"","83e5a3f0-bcce-11e8-8297-170e5243088e":"","83eb4940-bcce-11e8-8297-170e5243088e":"","83f18ad0-bcce-11e8-8297-170e5243088e":""},"ril-profilename":["Pro-382715374455794871298391537445579489","Pro1-382715374455794871298391537445579489","Pro2-382715374455794871298391537445579489","Pro3-382715374455794871298391537445579489"],"ril-profileowner":"613e0a4b-f3da-4587-843f-c2aa45bd74cc"}}};
let diffInput = params.diffInput;
//let diffResult = diff(diffInput.ldapData, diffInput.cassandraData);



//custom check 
/**
 * ril-profiledata - {}
 * ril-profilename - []
 * ril-profileowner -key
 */
let result = true;
let ldapData = diffInput.ldapData;
let cassandraData = diffInput.cassandraData;

if (ldapData["ril-profileowner"] == cassandraData["ril-profileowner"]){
    
    Object.keys(ldapData["ril-profiledata"]).forEach(key=>{
        if(ldapData["ril-profiledata"][key]!= cassandraData["ril-profiledata"][key]){
        	
            result = false;
        }
    });
    
    if (result && ldapData["ril-profilename"]){
        let value = ldapData["ril-profilename"][0];
        	let temp1 = false;
           	let len = cassandraData["ril-profilename"].length;
           	for(let i =0;i<len;i++){
           		if (cassandraData["ril-profilename"][i]== value){
           			temp1 = true;
           			break;
           		}
           	}
            result = temp1 ? true : false;
        

        if (result){
            result = true
        }
        else {
            result = false;
        }
    }
    else {
        result = false;
    }

}
else {
    result = false;
}
console.log(ldapData);
console.log(cassandraData);
console.log('result :: ' + result);