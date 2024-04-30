// var ItemJoinList = 1;
// const undefinedUser = {
//   id :178891989,
//   src:{
//     url: "./public/User2.png",
//     urlClient:"./public/undefinedUser.png"
//   },
//   GameLevele:"hard",
//   type : "User",
//   isJoin : true
// }

// const UserJoinList = [
//   {
//     id :178891989,
//     src:{
//       url: "./public/User2.png",
//       urlClient:"./public/User.png"
//     },
//     GameLevele:"hard",
//     type : "User",
//     isJoin : true
//   },
//   {
//     GameLevele:"Easy",
//     id :118848,
//     src: "./public/User2.png",
//     type : "Tournament",
//     isJoin : false
//   },
//   {
//     GameLevele: "Tournament",
//     current_players: 3,
//     id: 2,
//     isJoin: false,
//     max_players: 4,
//     src: "iVBORw0KGgoAAAANSUhEUgAAAjYAAAIACAYAAACRlSaFAAAAC",//"
//     type: "Tournament"
//   }
// ]
var GameRom = {
  creator_id :0,
  game_room_id : 0
}



class JoinList extends HtmlElement {
    constructor(){
      super(".JoinList")
      this._style.display = "none";
      this._JoinListInvit = new JoinListInvit();
      debugger;
    }
    _game_rooms = "";
    _CreateButton = document.querySelector(".JoinListHeroDivButtonB");
    _InviteButton = document.querySelector("#JoinListHeroDivButtonBInvite");
    // 2<div class="JoinListTd">
    // <img src="./public/User2.png" width="40" height="40"
    //             alt="Users" class=".JoinListTableImageBody"></img>
    // </div>
    twoSection(Item){
      const div2 = document.createElement("div");
      
      div2.setAttribute("class", "JoinListTd");
      const divImg = document.createElement("img");
      divImg.setAttribute("class", "JoinListTableImageBody");
      divImg.setAttribute("alt", "User");
      divImg.setAttribute("width", "40");
      divImg.setAttribute("height", "40");
      Item.type == "Tournament" ? divImg.setAttribute("src", `data:image/png;base64,${Item.src}`):divImg.setAttribute("src",  `data:image/png;base64,${Item.src[0].url}`);
      
      div2.appendChild(divImg);
      return div2
    }
    // 3<div class="JoinListTableBodyNAme">
    //    <p class="JoinListTableBodyNAmeP">Classic /Hard /Tornament Easy</p>
    //  </div>
    threeSection(Item){
      const div3 = document.createElement("div");
      div3.setAttribute("class", "JoinListTableBodyNAme");
      const div3P = document.createElement("p")
      div3P.setAttribute("class", "JoinListTableBodyNAmeP");
      div3P.innerHTML = Item.GameLevele;
      div3.appendChild(div3P);
      return div3;
    }

    //4<div class="JoinListTableBodyNAme">
    //     <img src="./public/Grup2.png" class="JoinListTableBodyNAmeImg"/>
    //     <button class="JoinListTableBodyNAmeMembers">Members</button>
    // </div>
    fourSection(Item){
      const div4 = document.createElement("div");
      div4.setAttribute("class", "JoinListTableBodyNAme");
      let div4Content;
      if (Item.type !== "Tournament"){
        div4Content = document.createElement("img");
        div4Content.setAttribute("class", "JoinListTableBodyNAmeImg");
        div4Content.setAttribute("src", `data:image/png;base64,${Item.src[0].urlClient}`)
      }
      else{
        div4Content = document.createElement("button")
        div4Content.setAttribute("class","JoinListTableBodyNAmeMembers");
        div4Content.setAttribute("id","JoinListTableBodyNAmeMembersid" + Item.id);
        div4Content.innerHTML = "Members";
      }
      div4.appendChild(div4Content);
      return div4;
    }
    // 5<div class="JoinListTableBodyNAme">
    //    <p>1/2</p>
    //  </div>
    fiveSection(Item){
      const div5 = document.createElement("div");
      div5.setAttribute("class", "JoinListTableBodyNAme")
      let div5P = document.createElement("p")
      div5P.innerHTML = `${Item.current_players}/${Item.max_players}`;
      div5.appendChild(div5P);
      return div5
    }
    // 6<div class="JoinListTableBodyNAme">
    //   <button id="JoinListTableID" class="JoinListTableClassJoin">Join</button>
    //   <button id="JoinListTableID" class="JoinListTableClassView">View</button>
    // </div>
    sixSection(Item){
      const div6 = document.createElement("div");
      div6.setAttribute("class", "JoinListTableBodyNAme");
      const div6Button = document.createElement("button");
      div6Button.setAttribute("id", Item.id + ":JoinListTableID:" + Item.creator_id);
      if(!Item.isJoin) {
        div6Button.setAttribute("class", "JoinListTableClassJoin");
        div6Button.innerHTML = "Join";
      }
      else {
        div6Button.setAttribute("class", "JoinListTableClassView");
        div6Button.innerHTML = "View";
      }
      debugger
      if (Item.creator_id == User._Id){
        div6Button.style.backgroundColor = "grey";
        div6Button.disabled = true;
      }
      div6.appendChild(div6Button);
      return div6;
    }

/* <div class="JoinListTableBody">

   1<div class="JoinListTableBodyNAme"><p class="JoinListTableBodyNAmeP1">1</p></div>
   2<div class="JoinListTd">
        <img src="./public/Item2.png" width="40" height="40"
                    alt="Items" class="JoinListTableImageBody"></img>
    </div>
   3<div class="JoinListTableBodyNAme"><p class="JoinListTableBodyNAmeP">Classic /Hard /Tornament Easy</p></div>
   4<div class="JoinListTableBodyNAme">
        <img src="./public/Grup2.png" class="JoinListTableBodyNAmeImg"/>
        <button class="JoinListTableBodyNAmeMembers">Members</button>
    </div>
   5<div class="JoinListTableBodyNAme"><p>1/2</p></div>
   6<div class="JoinListTableBodyNAme">
        <button id="JoinListTableID" class="JoinListTableClassJoin">Join</button>
        <button id="JoinListTableID" class="JoinListTableClassView">View</button>
    </div>
</div> */
    JoinListItem (Item){
      const divJoin = document.createElement("div");
      divJoin.setAttribute("class", "JoinListTableBody");
      //1
      const div1 = document.createElement("div");
      const div1P = document.createElement("p");
      div1P.setAttribute("class", "JoinListTableBodyNAmeP1");
      div1P.innerHTML = Item.id;
      div1.appendChild(div1P);
      //2
      const div2 = this.twoSection(Item);
      //3
      const div3 = this.threeSection(Item);
      //4
      const div4 = this.fourSection(Item);
      //5
      const div5 = this.fiveSection(Item);
      //6
      const div6 = this.sixSection(Item);
      divJoin.appendChild(div1)
      divJoin.appendChild(div2)
      divJoin.appendChild(div3)
      divJoin.appendChild(div4)
      divJoin.appendChild(div5)
      divJoin.appendChild(div6)
      const table = document.querySelector(".JoinListConteinerTableALL");
      table.appendChild(divJoin);
    }

    //join button set event listener
  setEventAllButton() {
    const buttonsJoin =  document.querySelectorAll(".JoinListTableClassJoin");
    const buttonsView =  document.querySelectorAll(".JoinListTableClassView");
    const buttonsMembers =  document.querySelectorAll(".JoinListTableBodyNAmeMembers");

    //    Iterate over each button and attach an event listener add Join
    buttonsJoin.forEach(button => {
      button.addEventListener("click", async function(e) {
        debugger
        // Item.id + ":JoinListTableID:" + Item.creator_id
        // api/v1/joinlist/<int:pk>/' POST
        console.log("  +++    " + e.target.id);
        const creator_id = e.target.id.slice(e.target.id.lastIndexOf(':')+1);
        const game_room_id = e.target.id.slice(0, e.target.id.indexOf(':'));
        
       
        // const creator_id = idLeft;
        // const game_room_id = idRight;

        // const data = await FetchRequest("POST", "api/v1/joinlist/" + User._Id, {
        //                     "creator_id": idRight,
        //                     'game_room_id': idLeft
        //                   });
        const paload = {
          "method": "join",
          "pk":User._Id,
          "user_id":User._Id,
          "creator_id": creator_id,
          'game_room_id': game_room_id
        }
        const str = JSON.stringify(paload);

        if (Join_Ws.readyState === WebSocket.OPEN) {
          console.log('WebSocket connection is open 222222222222');
          Join_Ws.send(str);
        }
      
        //When Have Error
        Join_Ws.onclose = function (e) {
          console.log("Something unexpected happened ! Join_Ws closed");
        };
      })
    })


    //    Iterate over each button and attach an event listener to View
    buttonsView.forEach(button => {

      button.addEventListener("click", async function(e) {

              // Your code here
              console.log(JSON.stringify(e.target.id));
              console.log("buttonsView");
        })
    })


    //    Iterate over each button and attach an event listener Members
    buttonsMembers.forEach(button => {
      button.addEventListener("click", async function(e) {
              // Your code here
              console.log(JSON.stringify(e.target.id));
              console.log("buttonsMembers!");
          })
      })
  }

  async draw() {
    debugger
    document.querySelector(".JoinListConteinerTableALL").innerHTML = "";
    if (this._game_rooms) {
        this._game_rooms.sort((e,e1)=>e.id < e1.id).forEach(e => {
            this.JoinListItem(e);
        });
    }
    this.setEventAllButton();
  }
}
