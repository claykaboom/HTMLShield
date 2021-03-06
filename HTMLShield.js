/// Created by Clayton Freitas - July, 2016
/// http://claytonfreitas.com.br 
/// https://github.com/claykaboom/HTMLShield/

function HTMLShield(interval, wrapjQuery) {
    var self = this;
    /***** INSTANTIANTION *******/

    /// privates
    self.__initialized = false;
    self.__htmlViolatedFunction = null;
    self.__interval = 1000;
    self.__isChecking = false; //Defines whether the Shield should check the DOM. Initialized with INIT
    self.__timer = null; // Timer to handle setTimeout
    self.__DEBUG = true;
    self.__originalDOMHTML = null;


    //// Starting observer  https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
    //self.__observer = new MutationObserver(function (mutations) {
    //    mutations.forEach(function (mutation) {
    //        if (mutation.target.nodeType == 1)
    //        {
    //            if (mutation.target.getAttribute("data-shield") == null ||
    //                (mutation.target.getAttribute("data-shield") != null && mutation.target.getAttribute("data-shield") == "false"
    //                ))
    //            {
    //                if (self.__htmlViolatedFunction != null) {
    //                    self.__log("HTML was violated.");
    //                      self.__htmlViolatedFunction("", ""); 
    //                }
    //            }
    //        }
    //        self.__log(mutation.type); // here you'll get the changes 
    //    });
    //});

    // configuration of the observer:
    self.__config = { attributes: true, childList: true, characterData: true, subtree: true };


    if (interval != null && interval >= 10) {
        self.__interval = interval;
    }

    self.__wrapKnockOut = function () {


    }

    self.__wrapjQuery = function () {

        Object.getOwnPropertyNames($.fn).filter(function (p) {
            return (typeof ($.fn[p]) === 'function' && p !== "init");
        }).forEach(function (funcName) {
            var orig = $.fn[funcName];
            $.fn[funcName] = function () {
                self.pause();

                var returnVar = orig.apply(this, arguments);
                self.start();
                return returnVar;
            }
        });
    }




    //receives a function delegate to trigger when the HTML is violated
    self.onHTMLViolated = function (fn) {
        if (fn != null) {
            self.__htmlViolatedFunction = fn;
        }
    }

    //Defines the Base HTML for DOM Violation Checking
    self.setGroundHTML = function () {
        self.__log("Ground HTML set.");
        self.__originalDOMHTML = document.getElementsByTagName("html")[0].innerHTML;
    }




    //Validates if DOM was violated. Trigger event if DOM is being monitored
    self.validateDOM = function () {
        if (self.__isChecking) {

            var comparingHTML = document.getElementsByTagName("html")[0].innerHTML;
            if (!self.__isHTMLUnviolated(self.__originalDOMHTML, comparingHTML)) {
                if (self.__htmlViolatedFunction != null) {
                    self.__log("HTML was violated.");
                   self.__htmlViolatedFunction(self.__originalDOMHTML, comparingHTML);
                    //TODO: Should I set the Ground HTML here?
                }
            }

            setTimeout(self.validateDOM, self.__interval);
        }
    }

    // Checks if DOM is sound, aligned with the base-version
    self.__isHTMLUnviolated = function (baseElement, comparedElement) {
        var baseElementHTML = baseElement;
        var comparedElementHTML = comparedElement;
        return (baseElementHTML == comparedElementHTML);
    }

    //initializes the Shield and starts watching the DOM
    self.init = function (startMonitoring) {
        if (!self.__initialized) {
            self.setGroundHTML();
            self.__initialized = true;
            if (startMonitoring == null || startMonitoring == true) {
                self.start();
            }
            self.__log("Shield initialized.");
        }
        return self;
    }

    self.start = function () {
        if ((!self.__initialized)) {
            throw Error("Shield is not initialized. Call init() before starting the monitoring.");
        }

        // pass in the target node, as well as the observer options
       // self.__observer.observe(document, self.__config);
        setTimeout(function () {
            self.setGroundHTML(); // now the base is the current HTML
            self.__isChecking = true;
            self.__timer = setTimeout(self.validateDOM, self.__interval);
            self.__log("Shield started.");
        },1); // we delay the start in 1ms so as to prevent a few MVVM changes from triggering the violation
        return self;
    }
    self.pause = function () {
        self.__isChecking = false;
        if (self.__timer) {
         //   self.__observer.disconnect();
            clearTimeout(self.__timer);
            self.__timer = null;
            self.__log("Shield paused.");
        }
        return self;
    }
    // Allows DOM changes without triggering Violations
    self.demilitarizedChange = function (operation) {
        var wasRunning = self.__isChecking;
        if (wasRunning) {
            self.pause();
        }
        if (operation) {
            operation();
        }
        if (wasRunning) {
            self.start();
        }
    }

    self.dmz = self.demilitarizedChange;
    self.dmc = self.demilitarizedChange;

    self.__log = function (message) {
        if (self.__DEBUG) {
            console.log(message);
        }
    }

    //startup calls


    if (jQuery && wrapjQuery != null && wrapjQuery == true) {
        self.__wrapjQuery();
    }

    //if (ko) {
    //    console.log("Wrapping KnockOut");
    //    self.__wrapKnockOut();
    //}

    //should it auto INIT?
    return self;
}