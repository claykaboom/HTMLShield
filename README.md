# HTML Shield

If you want to protect your HTML against developers trying to change it, or if you, for somereason want to track DOM changes, you should you HTML Shield;

## Usage
Reference HTMLShield.js.

After document is loaded you should instantiate an HTMLShield: 

    $(function () {  
             var shield = new HTMLShield(10, true); 
             shield.onHTMLViolated( 
                 function (prev, after) { 
                     location.reload(); //Reload document if HTML is violated 
                 })  
       }) 
