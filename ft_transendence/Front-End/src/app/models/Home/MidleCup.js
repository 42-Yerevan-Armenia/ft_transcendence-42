class MidleCub extends HtmlElement {
    constructor(){
      super(".MidleCub")
      this._style.display = "none";
      this.MidleCubHeroName = document.querySelector("#MidleCubHeroName");
      this.MidleCubHeroId = document.querySelector("#MidleCubHeroId");
      this.MidleCubImage = document.querySelector(".MidleCubImage");
    }

    // 1<div class="MidleCubTableBody">
    //  2 <div class="MidleCubTableBodyNAme">125</div>
    //   3<div class="MidleCubTd">
    //       <Image src="./public/User2.png" width="40" height="40"
    //       alt="Users" class=".MidleCubTableImageBody"></Image>

    //       <div class=".MidleCubTableBodyNAme">User2</div>
    //   </div>
    //   4<div class="MidleCubTableBodyNAme">125</div>
    //   5<div class="MidleCubTableBodyNAme">14</div>
    //   6<div class="MidleCubTableBodyNAme">150</div>
    // </div>

    midleCubItem(i, Item){
      //1
      const div1 = document.createElement("div");
      div1.setAttribute("class", "MidleCubTableBody");
      
      //2
      const div2 = document.createElement("div");
      div2.setAttribute("class", "MidleCubTableBodyNAme");
      div2.innerHTML = i;

      //3
      const div3 =  document.createElement("div");
      div3.setAttribute("class", "MidleCubTd");
      const img = document.createElement("img");
      img.setAttribute("class", "MidleCubTableImageBody");
      img.setAttribute("width", "40");
      img.setAttribute("height", "40");
      img.setAttribute("alt", "Users");
      img.setAttribute("src",`data:image/png;base64,${Item.image}`);
      
      const div3div = document.createElement("div");
      div3div.setAttribute("class", "MidleCubTableBodyNAme");
      div3div.innerHTML = Item.nickname;
      div3.appendChild(img);
      div3.appendChild(div3div);
      //4
      const div4 = document.createElement("div");
      div4.setAttribute("class", "MidleCubTableBodyNAme");
      div4.innerHTML = Item.wins;
      //5
      const div5 = document.createElement("div");
      div5.setAttribute("class", "MidleCubTableBodyNAme");
      div5.innerHTML = Item.loses;
      //6
      const div6 = document.createElement("div");
      div6.setAttribute("class", "MidleCubTableBodyNAme");
      div6.innerHTML = Item.matches;
      div1.appendChild(div2);
      div1.appendChild(div3);
      div1.appendChild(div4);
      div1.appendChild(div5);
      div1.appendChild(div6);
      const domDat = document.querySelector(".MidleCubEditSection")
      domDat.appendChild(div1);
    }



    //Section Cup Drow DOM
    async setHero(){
      let i = 1;
      //headerSection
      this.MidleCubHeroName.innerHTML = User._Name;
      this.MidleCubHeroId.innerHTML = User._Id;
      this.MidleCubImage.src =`data:image/png;base64,${User._Image}`
      const Items = await getFetchRequest("api/v1/leaderboard/" + User._Id);
      //bodySection
      if (!Items || !Items.state)
        return;
      Items.message.leaderboard.sort((e, e2)=>{
        return e.points < e2.points
      }).forEach(Item => {
        this.midleCubItem(i++, Item)
      });
    }
    async draw(){
      debugger
      await this.setHero();
    }
  
  }
  