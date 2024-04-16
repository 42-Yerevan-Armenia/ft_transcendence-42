// const dataUser12List =[
//   {
//     src : "./public/User.png",
//     nickname :"User.png",
//     innerHtml: "123456 points",
//     pointer :5646,
//     live : true
//   },
//   {
//   src : "./public/User.png",
//   nickname :"User.png",
//   innerHtml: "123456 points",
//   pointer :45646,
//   live : false
//   },
//   {
//     src : "./public/User.png",
//     nickname :"User.png",
//     innerHtml: "123456 points",
//     pointer :345646,
//     live : true
//   },
//   {
//   src : "./public/User.png",
//   nickname :"User.png",
//   innerHtml: "123456 points",
//   pointer :12345,
//   live : false
//   },
//   {
//     src : "./public/User.png",
//     nickname :"User.png",
//     innerHtml: "123456 points",
//     pointer :145,
//     live : true
//   },
//   {
//   src : "./public/User.png",
//   nickname :"User.png",
//   innerHtml: "123456 points",
//   pointer :4564646,
//   live : false
//   },
//   {
//     src : "./public/User.png",
//     nickname :"User.png",
//     innerHtml: "123456 points",
//     pointer :45646,
//     live : true
//   },
//   {
//   src : "./public/User.png",
//   nickname :"User.png",
//   innerHtml: "123456 points",
//   pointer :4564646,
//   live : false
//   },
//   {
//     src : "./public/User.png",
//     nickname :"User.png",
//     innerHtml: "123456 points",
//     pointer :145,
//     live : true
//   },
//   {
//   src : "./public/User.png",
//   nickname :"User.png",
//   innerHtml: "123456 points",
//   pointer :4564646,
//   live : false
//   },
//   {
//     src : "./public/User.png",
//     nickname :"User.png",
//     innerHtml: "123456 points",
//     pointer :45646,
//     live : true
//   },
//   {
//   src : "./public/User.png",
//   nickname :"User.png",
//   innerHtml: "123456 points",
//   pointer :4564646,
//   live : false
//   },
//   {
//     src : "./public/User.png",
//     nickname :"User.png",
//     innerHtml: "123456 points",
//     pointer :145,
//     live : true
//   },
//   {
//   src : "./public/User.png",
//   nickname :"User.png",
//   innerHtml: "123456 points",
//   pointer :4564646,
//   live : false
//   },
//   {
//     src : "./public/User.png",
//     nickname :"User.png",
//     innerHtml: "123456 points",
//     pointer :45646,
//     live : true
//   },
//   {
//   src : "./public/User.png",
//   nickname :"User.png",
//   innerHtml: "123456 points",
//   pointer :4564646,
//   live : false
//   }
// ]

//Middle Sections inside for Home Page
class MiddleSECTION extends HtmlElement {
    constructor(){
      super(".MIDLESECTION")
      this._style.display = "flex";
      this.dataUser12List = 0;
    }
    // <div class="item">
    //     <Image src="./public/User.png" width="60" height="60"
    //         alt="user" class="imag"></Image>
    //     <h6 class="itemName">User.png</h6>
    //     <p class="itemP">123456 points</p>
    // </div>

    async topPlayers(Item){
      const item = document.createElement("div");
      item.setAttribute("class", "item");
      item.setAttribute("id", "item [" + Item.id + "]");
      const img = document.createElement("img");
      img.setAttribute("class", "imag");
      img.setAttribute("alt", "user");
      img.setAttribute("width", "60");
      img.setAttribute("height", "60");
      img.setAttribute("src", `data:image/png;base64,${Item.image}`);

      const h6 = document.createElement("h6");
      h6.setAttribute("class", "itemName");
      h6.innerHTML = Item.nickname;

      const p = document.createElement("p");
      p.setAttribute("class", "itemP");
      p.innerHTML = Item.points + " points"


      item.appendChild(img);
      item.appendChild(h6);
      item.appendChild(p);
      document.querySelector("#playersIdTopMidle").appendChild(item);
    }

    // <div class="liveitem">
    //   <Image src="./public/User.png" width="60" height="60"
    //       alt="user" class="imag"></Image>
    //   <div class="PlayIcon" id=idIcon${item.id}>
    //       <PlayIcon/>
    //    </div>
    // </div>

    async liveNow(item, i){
      let row;

      const liveItem = document.createElement("div");
      liveItem.setAttribute("class", "liveitem");
      liveItem.setAttribute("id", "liveitem" + item.id);
      const img = document.createElement("img");
      // img.setAttribute("src", item.src);
      // `data:image/png;base64,${User._Image}`
      img.setAttribute("src", `data:image/png;base64,${item.image}`);
      img.setAttribute("width", "60");
      img.setAttribute("height", "60");
      img.setAttribute("alt", "user");
      img.setAttribute("class", "imag");
      
      const divPlayIcon = document.createElement("div");
      divPlayIcon.setAttribute("class", "PlayIcon");
      
      const icon = document.createElement("div");
      icon.innerHTML = PlayIconFront;

      //i change iii  = 123
      divPlayIcon.setAttribute("id", `id=idIcon${item.id}`)
      divPlayIcon.appendChild(icon);

      liveItem.appendChild(img)
      liveItem.appendChild(divPlayIcon)

      if (i < 3)
        row = document.querySelector("#row1")
      else
        row = document.querySelector("#row2")
      row.appendChild(liveItem);
    }

    async loadBackEndX(){
      debugger
        const Items =  await getPureFetchRequest("users");

        if (!Items || !Items.state)
          return;

        const dataAllItem = Items.message.sort((e, e2)=>{
          return e.points < e2.points
        })
        console.log("dataAllItem  =  ")
        console.log(dataAllItem);
        return dataAllItem;
    }
    
    
    async drawList(){
      this.dataUser12List = 0;
      this.dataUser12List = await this.loadBackEndX();
  
      
      if (!this.dataUser12List)
      return ;
      
      const TopPlayerList = this.dataUser12List?.slice(0, 6);
      
      document.querySelector("#row1").innerHTML = "";
      document.querySelector("#row2").innerHTML = "";
      document.querySelector("#playersIdTopMidle").innerHTML = "";

      if (TopPlayerList)
      {
        TopPlayerList.forEach(async (e, i) => {
          if (i < 5)
            await this.topPlayers(e);
        })
      }
      const LiveNowList = this.dataUser12List?.filter(e => e.live)?.slice(0, 6);
      if (LiveNowList)
      {
        LiveNowList.forEach(async (e, i) => {
          console.log("eeeeee  {" + i +"} ")
          console.log(e);
          await this.liveNow(e, i);
        })
      }

    }


    async draw()
    {
      //debugger
      await this.drawList();
    }
  }
  