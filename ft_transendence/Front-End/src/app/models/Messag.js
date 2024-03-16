function Element(name) {
    this._classname = document.querySelector(name);
    this._style = this._classname ? this._classname.style : null;
}

Element.prototype.DisplayBlock = function() {
    if (this._style)
        this._style.display = "block";
}

Element.prototype.DisplayNone = function() {
    if (this._style)
        this._style.display = "none";
}

var MessagePage = function(name) {
    Element.call(this,name);                             // Call the parent constructor
    this.name = name;
    this.Groups = () => {
        console.log("Groups " + this.name);
    };
    this.PersonalAnnons = () => {
        console.log("PersonalAnnons " + this.name);
    };
    this.chat = () => {
        console.log("chat " + this.name);
    };
    this.Drow = () => {
      
    }
}

MessagePage.prototype = Object.create(Element.prototype, {
    constructor: {
        value: MessagePage,
        enumerable: false,
        writable: true,
        configurable: true
    }
});

