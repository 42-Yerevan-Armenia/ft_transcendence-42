var ItemJoinList = 1;
const UserJoinList = [
  {
    id :178891989,
    src:{
      url: "./public/User2.png",
      urlClient:"./public/User.png"
    },
    GameLevele:"hard",
    type : "User",
    isJoin : true
  },
  {
    id :118848,
    src: "./public/User2.png",
    GameLevele:"Easy",
    type : "Tournament",
    isJoin : false
  }
]
class JoinList extends HtmlElement {
    constructor(){
      super(".JoinList")
      this._style.display = "none";
    }
    // 2<div class="JoinListTd">
    // <img src="./public/User2.png" width="40" height="40"
    //             alt="Users" class=".JoinListTableImageBody"></img>
    // </div>
    twoSection(User){
      const div2 = document.createElement("div");
      
      div2.setAttribute("class", "JoinListTd");
      const divImg = document.createElement("img");
      divImg.setAttribute("class", ".JoinListTableImageBody");
      divImg.setAttribute("alt", "Users");
      divImg.setAttribute("width", "40");
      divImg.setAttribute("height", "40");
      User.type == "Tournament" ? divImg.setAttribute("src", "./public/Turnament.png"):divImg.setAttribute("src", User.src.url);
      
      div2.appendChild(divImg);
      return div2
    }
    // 3<div class="JoinListTableBodyNAme">
    //    <p class="JoinListTableBodyNAmeP">Classic /Hard /Tornament Easy</p>
    //  </div>
    threeSection(User){
      const div3 = document.createElement("div");
      div3.setAttribute("class", "JoinListTableBodyNAme");
      const div3P = document.createElement("p")
      div3P.setAttribute("class", "JoinListTableBodyNAmeP");
      div3P.innerHTML = User.GameLevele;
      div3.appendChild(div3P);
      return div3;
    }

    //4<div class="JoinListTableBodyNAme">
    //     <img src="./public/Grup2.png" class="JoinListTableBodyNAmeImg"/>
    //     <button class="JoinListTableBodyNAmeMembers">Members</button>
    // </div>
    fourSection(User){
      const div4 = document.createElement("div");
      div4.setAttribute("class", "JoinListTableBodyNAme");
      let div4Content;
      if (User.type !== "Tournament"){
        div4Content = document.createElement("img");
        div4Content.setAttribute("class", "JoinListTableBodyNAmeImg");
        div4Content.setAttribute("src", User.src.urlClient)
      }
      else{
        div4Content = document.createElement("button")
        div4Content.setAttribute("class","JoinListTableBodyNAmeMembers");
        div4Content.innerHTML = "Members";
      }
      div4.appendChild(div4Content);
      return div4;
    }
    // 5<div class="JoinListTableBodyNAme">
    //    <p>1/2</p>
    //  </div>
    fiveSection(User){
      const div5 = document.createElement("div");
      div5.setAttribute("class", "JoinListTableBodyNAme")
      let div5P = document.createElement("p")
      div5P.innerHTML = "1/2"
      div5.appendChild(div5P);
      return div5
    }
    // 6<div class="JoinListTableBodyNAme">
    //   <button id="JoinListTableID" class="JoinListTableClassJoin">Join</button>
    //   <button id="JoinListTableID" class="JoinListTableClassView">View</button>
    // </div>
    sixSection(User){
      const div6 = document.createElement("div");
      div6.setAttribute("class", "JoinListTableBodyNAme");
      const div6Button = document.createElement("button");
      div6Button.setAttribute("id", "JoinListTableID");
      if(User.isJoin)
      {
        div6Button.setAttribute("class", "JoinListTableClassJoin");
        div6Button.innerHTML = "Join";

      }
      else{
        div6Button.setAttribute("class", "JoinListTableClassView");
        div6Button.innerHTML = "View";
      } 
      div6.appendChild(div6Button);
      return div6;
    }

/* <div class="JoinListTableBody">

   1<div class="JoinListTableBodyNAme"><p class="JoinListTableBodyNAmeP1">1</p></div>
   2<div class="JoinListTd">
        <img src="./public/User2.png" width="40" height="40"
                    alt="Users" class=".JoinListTableImageBody"></img>
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
    JoinListItem(i, User){
      debugger
      const divJoin = document.createElement("div");
      divJoin.setAttribute("class", "JoinListTableBody");
      //1
      const div1 = document.createElement("div");
      const div1P = document.createElement("p");
      div1P.setAttribute("class", "JoinListTableBodyNAmeP1");
      div1P.innerHTML = ItemJoinList++;
      div1.appendChild(div1P);
      //2
      const div2 = this.twoSection(User);
      //3
      const div3 = this.threeSection(User);
      //4
      const div4 = this.fourSection(User);
      //5
      const div5 = this.fiveSection(User);
      //6
      const div6 = this.sixSection(User);
      divJoin.appendChild(div1)
      divJoin.appendChild(div2)
      divJoin.appendChild(div3)
      divJoin.appendChild(div4)
      divJoin.appendChild(div5)
      divJoin.appendChild(div6)
      const table = document.querySelector(".JoinListConteinerTableALL");
      table.appendChild(divJoin);
    }

    Drow(){
      debugger
      document.querySelector(".JoinListConteinerTableALL").innerHTML = "";
      this.JoinListItem(ItemJoinList, UserJoinList[0]);
      this.JoinListItem(ItemJoinList, UserJoinList[1]);
    }
  
  }
  