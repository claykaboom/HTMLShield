/// Created by Clayton Freitas - July, 2016
/// http://claytonfreitas.com.br 
/// https://github.com/claykaboom/HTMLShield/

function HTMLShield(interval, wrapjQuery) {
    var self = this;

    self.__initialized = false;
    self.__htmlViolatedFunction = null;
    self.__interval = 1000;
    self.__isChecking = false; //Defines whether the Shield should check the DOM. Initialized with INIT

    self.__wrapKnockOut = function () {
         

    }

    self.__wrapjQuery = function () {

        Object.getOwnPropertyNames($.fn).filter(function (p) {
            return (typeof ($.fn[p]) === 'function' && p !== "init");
        }).forEach(function (funcName) {
            var orig = $.fn[funcName];
            $.fn[funcName] = function () {
                self.__isChecking = false;
                //console.log(funcName + " jQuery method called");
                var returnVar = orig.apply(this, arguments);
                self.setGroundHTML();
                self.__isChecking = true;
                return returnVar;
            }
        });
    }

    if (jQuery && wrapjQuery != null && wrapjQuery == true) {
        self.__wrapjQuery();
    }

    //if (ko) {
    //    console.log("Wrapping KnockOut");
    //    self.__wrapKnockOut();
    //}

    if (interval != null && interval >= 10) {
        self.__interval = interval;
    }

    self.myOriginalDOMHTML = null;

    self.onHTMLViolated = function (fn) {
        if (fn != null) {
            self.__htmlViolatedFunction = fn;
        }
    }

    //Defines the Base HTML for DOM Violation Checking
    self.setGroundHTML = function () {
        self.myOriginalDOMHTML = document.getElementsByTagName("html")[0].innerHTML;
    }


    //Validates if DOM was violated. Trigger event if DOM is being monitored
    self.validateDOM = function () {
        if (self.__isChecking) {
            var comparingHTML = document.getElementsByTagName("html")[0].innerHTML;
            if (!self.IsHTMLUnviolated(self.myOriginalDOMHTML, comparingHTML)) {
                if (self.__htmlViolatedFunction != null) {
                    self.__htmlViolatedFunction(self.myOriginalDOMHTML, comparingHTML);
                    self.setGroundHTML(); // now the base is the current HTML
                }
            }

            setTimeout(self.validateDOM, self.__interval);
        }
    }

    self.IsHTMLUnviolated = function (baseElement, comparedElement) {
        var baseElementHTML = baseElement;
        var comparedElementHTML = comparedElement;
        return (baseElementHTML == comparedElementHTML);
    }

    self.init = function () {
        if (!self.__initialized) {
            self.setGroundHTML();
            setTimeout(self.validateDOM, self.__interval);
            self.__initialized = true;
            self.__isChecking = true;
        }
        return self;
    }

    return self.init();
}