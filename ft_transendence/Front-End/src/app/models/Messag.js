
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


let Privat = [

        PrivatPerson = {
            id: 1,
            username:"UserA",
            message:"Hi there, How are you?",
            time: "9.20 AM"
        },
        PrivatSender = {
            id: 2,
            username:"UserB",
            message:"I am great, Thanks!",
            time: "9.23 AM"
        },
        PrivatSender = {
            id: 2,
            username:"UserB",
            message:"I am great, Thanks!",
            time: "9.23 AM"
        },
        PrivatSender = {
            id: 3,
            username:"UserC",
            message:"I am great, Thanks!",
            time: "9.23 AM"
        },
        PrivatPerson = {
            id: 1,
            username:"UserA",
            message:"Hi there, How are you?",
            time: "9.20 AM"
        },
        PrivatSender = {
            id: 4,
            username:"UserB",
            message:"I am great, Thanks!",
            time: "9.23 AM"
        },
        PrivatPerson = {
            id: 1,
            username:"UserA",
            message:"Hi there, How are you?",
            time: "9.20 AM"
        },  
        PrivatSender = {
            id: 3,
            username:"UserB",
            message:"I am great, Thanks!",
            time: "9.23 AM"
        }
]





//___________________________________________________________________

function ElementData(name) {
    this._classname = document.querySelector(name);
    this._style = this._classname ? this._classname.style : null;
}
ElementData.prototype.Classname = function(){
    console.log(" this._classname   ======= " + this._classname)
    return this._classname;
}

ElementData.prototype.Style = function(){
    console.log(" this._style    =======    " + this._style)
    return this._style;
}



ElementData.prototype.DisplayBlock = function() {
    if (this._style)
        this._style.display = "block";
}

ElementData.prototype.DisplayNone = function() {
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
ElementData.prototype.createBlock = function(Group, nameElement) {
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

{/* 
<div class="MessagPrivateSubjectMessagPerson">
    <div class="MessagPrivateSubjectMessagDivPerson">
        <p class="MessagPrivateSubjectMessagPersonChat">
            Hi there, How are you?
        </p>
    </div>
    <p>
        9.20 AM
    </p>
</div>
*/}

ElementData.prototype.MessagPrivateSubjectMessagPerson = function(Person) {
    debugger
    const node = document.createElement("div")
    node.setAttribute("class", "MessagPrivateSubjectMessagPerson");
      const PersonDiv = document.createElement("div")
        PersonDiv.setAttribute("class", "MessagPrivateSubjectMessagDivPerson");
        const PersonDivP = document.createElement("p")
            PersonDivP.setAttribute("class", "MessagPrivateSubjectMessagPersonChat");
    const PersonP = document.createElement("p");

    PersonDivP.innerHTML =  Person.message;
    PersonP.innerHTML = Person.time;

    PersonDiv.appendChild(PersonDivP)
    node.appendChild(PersonDiv);
    node.appendChild(PersonP);
    document.querySelector(".MessagPrivateSubjectMessag").appendChild(node);
}



{/* 
<!-- Sender -->
<div class="MessagPrivateSubjectMessagSender">
    <div class="MessagPrivateSubjectMessagSenderDivMessag">
        <p class="MessagPrivateSubjectMessagSenderMessag">
            I am great, Thanks!
        </p>
    </div>
    <p class="MessagPrivateSubjectMessagSenderDaye">
        9.23 AM
    <p>
</div>
*/}

ElementData.prototype.MessagPrivateSubjectMessagSender = function(Person) {
    debugger
    const node = document.createElement("div");
    node.setAttribute("class", "MessagPrivateSubjectMessagSender");
    const nodeDiv = document.createElement("div")
        nodeDiv.setAttribute("class", "MessagPrivateSubjectMessagSenderDivMessag");
    const nodeDivP = document.createElement("p")
        nodeDivP.setAttribute("class", "MessagPrivateSubjectMessagSenderMessag");

    const nodeP = document.createElement("p")
        nodeP.setAttribute("class", "MessagPrivateSubjectMessagSenderDaye");

    nodeDivP.innerHTML = Person.message;
    nodeP.innerHTML = Person.time;
    
    nodeDiv.appendChild(nodeDivP);
    node.appendChild(nodeDiv);
    // node.appendChild(nodeP);

    document.querySelector(".MessagPrivateSubjectMessag").appendChild(node);
}




var MessagePage = function(name) {
    ElementData.call(this, name);                                                     // Call the parent constructor
    this.name = name;

    //for chat Groups
    this.Groups = (Groups) => {
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
    this.Personal = (Persons) => {
        //request to backend for tacke all groups what user have 
        //const Persons = await getFetchRequest("Personal");

        if (!Persons.state)
        return null;

        document.getElementById("addChildPersonal").style.display = "none";       // for start new message drow
        Persons.message.forEach(element => {
         this.createBlock(element, "Personal")
        });
        console.log("PersonalAnnons " + this.name);
    };

    // for chat private
    this.chat = (chatPersonal) => {
        debugger
        console.log("chat " + this.name);

        chatPersonal.forEach((Person)=>{
            if(Person.id == User._Id)
                this.MessagPrivateSubjectMessagPerson(Person)
            else
                this.MessagPrivateSubjectMessagSender(Person)
        })
    };


    this.Drow = async () => {
        debugger
        if (!await User.menegAccsess())
            return null;
        
        this.Groups(Groups);
        this.Personal(Groups);
        this.chat(Privat);
    }
}

MessagePage.prototype = Object.create(ElementData.prototype, {
    constructor: {
        value: MessagePage,
        enumerable: false,
        writable: true,
        configurable: true
    }
});

