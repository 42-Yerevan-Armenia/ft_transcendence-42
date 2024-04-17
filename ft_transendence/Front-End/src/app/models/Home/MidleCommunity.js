class MidleCommunity extends HtmlElement {
    // //debugger
      constructor() {
        super(".MidleCommunity")
        this._style.display = "none";
        this.MidleCubHeroName = document.querySelector("#MidleCommunityHeroName");
        this.MidleCubHeroId = document.querySelector("#MidleCommunityHeroId");
        this.MidleCubImage = document.querySelector(".MidleCommunityImage");
        this.Items = "";
      }

      isfriends(Item){
    
        return false;
      }
      eventsListenerAddFriends(){
        debugger
        const notFriends = document.querySelectorAll(".CommunityAddFriends");
        //[{0:CommunityAddFriends},{1:CommunityAddFriends} , {2:CommunityAddFriends} ]
        notFriends.forEach((e)=>{
            //{0:CommunityAddFriends}.addEventListener
          e.addEventListener("click", async (item)=>{
            //<button id="1">
            console.log(JSON.stringify(item.target.id));

            // if (item.target.display === true)
            // {
            //   console.log("if (e.target.style.display === true)111111111")
            // }
            // else{
            //   console.log("if (e.target.style.display === true)2222222222")
            // }
          })
        })
      }
  // 1<div class="MidleCommunityTableBody">
  // 2   <div class="MidleCommunityTableBodyNAme">125</div>
  // 3   <div class="MidleCommunityTd">
  //         <Image src="./public/User2.png" width="40" height="40"
  //         alt="Users" class="MidleCommunityTableImageBody"></Image>
  //         <div class="MidleCommunityTableBodyNAme">User2</div>
  //     </div>
  //  4   <div class="MidleCommunityTableBodyNAme">125</div>
  //  5   <div class="MidleCommunityTableBodyNAme">
  //         <button id="CommunityAddFriends:1" class="CommunityAddFriends">
  //             ADD Friends
  //         </button>
  //     </div>
  //   6  <div class="MidleCommunityTableBodyNAme">
  //         <button id="CommunitySeeUser:1" class="CommunitySeeUser">
  //             See Account
  //         </button>
  //     </div>
  // </div>
    MidleCommunityTableBodyI(i, Item){
      debugger
            //1
            const div1 = document.createElement("div");
            div1.setAttribute("class", "MidleCommunityTableBody");
            
            //2
            const div2 = document.createElement("div");
            div2.setAttribute("class", "MidleCommunityTableBodyNAme");
            div2.innerHTML = i;
      
            //3
            const div3 =  document.createElement("div");
            div3.setAttribute("class", "MidleCommunityTd");
            const img = document.createElement("img");
            img.setAttribute("class", "MidleCommunityTableImageBody");
            img.setAttribute("width", "40");
            img.setAttribute("height", "40");
            img.setAttribute("alt", "Users");
            img.setAttribute("src",`data:image/png;base64,${Item.image}`);
            
            const div3div = document.createElement("div");
            div3div.setAttribute("class", "MidleCommunityTableBodyNAme");
            div3div.innerHTML = Item.nickname;
            div3.appendChild(img);
            div3.appendChild(div3div);

            //4
            const div4 = document.createElement("div");
            div4.setAttribute("class", "MidleCommunityTableBodyNAme");
            div4.innerHTML = Item.points;

            //5
            const div5 = document.createElement("div");
            div5.setAttribute("class", "MidleCommunityTableBodyNAme");
            const div5Buddon = document.createElement("button");
            div5Buddon.setAttribute("class", "CommunityAddFriends");
            div5Buddon.setAttribute("id", "CommunityAddFriends:" + Item.id);

            // check if user already friend or note
            if (this.isfriends(Item))
            {
              div5Buddon.setAttribute("disabled","true");
              div5Buddon.style.backgroundColor = "#dddddd";
            }
            div5Buddon.innerHTML = "Add Friend";
            div5.appendChild(div5Buddon);

            //6
            const div6 = document.createElement("div");
            div6.setAttribute("class", "MidleCommunityTableBodyNAme");
            const div6Buddon = document.createElement("button");
            div6Buddon.setAttribute("class", "CommunitySeeUser");
            div6Buddon.setAttribute("id", "CommunitySeeUser:" + Item.id);
            div6Buddon.innerHTML = "Account";
            div6.appendChild(div6Buddon);
            //All
            div1.appendChild(div2);
            div1.appendChild(div3);
            div1.appendChild(div4);
            div1.appendChild(div5);
            div1.appendChild(div6);
            const domDat = document.querySelector(".MidleCommunityEditSection")
            domDat.appendChild(div1);
    }

    //Section Cup Drow DOM
    async setHero(){
      debugger
      let i = 1;
      this.Items = "";
      const domDat = document.querySelector(".MidleCommunityEditSection")
      domDat.innerHTML = "";
      //headerSection
      this.MidleCubHeroName.innerHTML = User._Name;
      this.MidleCubHeroId.innerHTML = User._Id;
      this.MidleCubImage.src =`data:image/png;base64,${User._Image}`
      this.Items = await getFetchRequest("users");
      //bodySection
      if (!this.Items || !this.Items.state)
        return;
      this.Items.message.sort((e, e2)=>{
        return e.points < e2.points
      }).forEach(Item => {
        if (Item.id !== User._Id)
          this.MidleCommunityTableBodyI(i++, Item)
      });

      this.eventsListenerAddFriends();
    }

    async draw(){
      debugger
      await this.setHero();
    }
}
// Users/  request
// background: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAMDAwMDAwQEBAQFB"
// email: "hovhannes_vardanyan1@mail.ru"
// gamemode: "classic"
// id: 1
// image: img base 64 url
// is_online: true
// live: false
// loses: 0
// matches: 0
// name: "Hovo"
// nickname: "Hovo"
// phone: null
// points: 0
// wins: 0
//friends[id:5,id:6]

// join 
// path('api/v1/send/<int:pk>/', SendFriendRequest.as_view()),
// sender =       request.user
// receiver_id =  request.data.get('receiver_id')
// receiver =     Person.objects.get(id=receiver_id).user
// api/v1/send/User.id/
// {
//   user: User{
//     id:1
//   },
//   receiver_id:
// }


// path('api/v1/accept/<int:pk>/', AcceptFriendRequest.as_view()),        
// path('api/v1/reject/<int:pk>/', RejectFriendRequest.as_view()),
// path('api/v1/delete/<int:pk>/', DeleteFriend.as_view()),
// path('api/v1/block/<int:pk>/', BlockRequest.as_view()),
// path('api/v1/unblock/<int:pk>/', UnblockRequest.as_view()),
// path('api/v1/friendlist/<int:pk>/', Friendlist.as_view()),