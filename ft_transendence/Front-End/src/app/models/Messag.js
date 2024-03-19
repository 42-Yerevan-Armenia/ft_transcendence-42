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


//function add this html code
// <div class="GrupADD">                             //divSubject
//     <img src="./public/Grup1.png" alt="Grup1">   //imag
//     <div class="GrupADDSubject">
//         <div>                                    // divFirst
//             <h5>Family Group</h5>
//             <p>Hey, Whats up</p>
//         </div>                                   //divSecond
//         <div id="GrupADDPoint">
//             <p>15</p>
//         </div>
//     </div>
// </div>
Element.prototype.createBlock = function(Group, nameElement) {
    const node = document.createElement("div");
    node.setAttribute("class", `${nameElement}ADD`)

    let imag = document.createElement("img");
    imag.setAttribute("alt", Group.name);
    imag.setAttribute("src", Group.src);

    const divSubject = document.createElement("div");
    divSubject.setAttribute("class",`${nameElement}ADDSubject`)

    //         <div>                                    // divFirst
    //             <h5>Family Group</h5>
    //             <p>Hey, Whats up</p>
    //         </div>      
    const divFirst = document.createElement("div");
    const h5 = document.createElement("h5");
    const nameText = Group.name?.length > 14 ? (Group.name.slice(0,13) + "...") : Group.name; // slice AAAAAAAAAAAAA => "AAAAAAAA..."
    h5.innerHTML = nameText;

    const p = document.createElement("p");
    const text = Group.message?.length > 14 ? (Group.message.slice(0,13) + "...") : Group.message; // slice AAAAAAAAAAAAA => "AAAAAAAA..."
    p.innerHTML = text;
    divFirst.appendChild(h5)
    divFirst.appendChild(p)

    //         <div id="GrupADDPoint">
    //             <p>15</p>
    //         </div>
    const divSecond = document.createElement("div");
    divSecond.setAttribute("id", `${nameElement}ADDPoint`);
    const secondP = document.createElement("p");
    secondP.innerHTML = Group.count + " ";

    divSecond.appendChild(secondP);

    divSubject.appendChild(divFirst)
    divSubject.appendChild(divSecond)

    node.appendChild(imag)
    node.appendChild(divSubject);
    document.getElementById(`addChild${nameElement}`).style.display = "block";
    document.getElementById(`addChild${nameElement}`).appendChild(node);
}

let Groups = {
    state: true,
    message: [
            {
                name: "Family Group",
                src :"./public/Grup1.png",
                message: "Hey, Whats up",
                count:15
            },
            {
                name: "Family Group",
                src :"./public/Grup1.png",
                message: "Hey, Whats up",
                count:15
            },
            {
                name: "Family Group",
                src :"./public/Grup1.png",
                message: "Hey, Whats up",
                count:15
            }
    ]
}

var MessagePage = function(name) {
    Element.call(this,name);                                                     // Call the parent constructor
    this.name = name;

    //for chat Groups
    this.Groups = () => {
        //request to backend for tacke all groups what user have 
        //const Groups = await getFetchRequest("groups");                        // Controller Get Groups

        if (!Groups.state)
            return null;

        document.getElementById("addChildGrup").style.display = "none";       // for start new message drow
        Groups.message.forEach(element => {
             this.createBlock(element, "Grup")
            });
        console.log("Groups " + this.name);
    };


    // for chat Personal
    this.Personal = () => {
        //request to backend for tacke all groups what user have 
        //const Persons = await getFetchRequest("Personal");  
        let Persons = Groups;
        if (!Persons.state)
        return null;

        document.getElementById("addChildPersonal").style.display = "none";       // for start new message drow
        Persons.message.forEach(element => {
         this.createBlock(element, "Personal")
        });
        console.log("PersonalAnnons " + this.name);
    };

    // for chat private
    this.chat = (chat) => {
        console.log("chat " + this.name);
    };

    this.Drow = async () => {
        debugger
        if (!await User.menegAccsess())
            return null;
        
        this.Groups();
        this.Personal();

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

