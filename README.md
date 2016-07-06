# HTML Shield

If you want to protect your HTML against developers trying to change it, or if you, for somereason want to track DOM changes, you should you HTML Shield;

## Usage
Reference HTMLShield.js.

After document is loaded you should instantiate an HTMLShield. You can also associate the shield to your document to access it from other places:

	    $(function () {

            document.htmlShield = new HTMLShield().init();
            document.htmlShield.onHTMLViolated(
					function (prev, after) {
						$("html").html(prev); // recreates the whole DOM using jQuery
						//Do something if document is violated
					}
			);

        });

### Initialization

Initialization must happen after instantiation. To instantiate a shield you should define:
* DOM Monitoring interval (minimum is 10ms)
* If jQUery should be wrapped so as every change it makes to the DOM does not violate the HTML

        new HTMLShield( interval, wrapjQuery)