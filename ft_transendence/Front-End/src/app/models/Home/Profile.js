const friend = {
  url:"./public/Grup2.png",
  name : "Karen Hakobyan"
}


class MidleProfile extends HtmlElement {
    constructor(){
      super(".ProfileMidle")
      this._style.display = "none";
    }
    _ProfileMidleHeaderToInvit1 = document.querySelector("#ProfileMidleHeaderToInvit1");
    _ProfileMidleHeaderToInvit2 = document.querySelector("#ProfileMidleHeaderToInvit2");
/* <div class="ProfileMidleFooterUser">
    <img src="./public/Grup2.png" alt="Friends" class="ProfileMidleFooterUserImage">
    <p class="ProfileMidleFooterUserName">User1</p>
</div> */
    frendsdrawScreen(friend){
      const divProf = document.createElement("div");
      divProf.setAttribute("class", "ProfileMidleFooterUser");
      const img = document.createElement("img");
      img.setAttribute("class","ProfileMidleFooterUserImage");
      img.setAttribute("alt", "Friends");
      img.src= friend.url;
      const p = document.createElement("div");
      p.setAttribute("class", "ProfileMidleFooterUserName");
      p.innerHTML = friend.name;
      divProf.appendChild(img);
      divProf.appendChild(p);

      const ProfileMidleFooterDiv  = document.querySelector(".ProfileMidleFooterDiv");
      ProfileMidleFooterDiv.appendChild(divProf);
    }
    async getFriends(){
      const friends = await getFetchRequest("friends");

      if (friends && friends.state)
      {
        friends.forEach(item => {
           this.frendsdrawScreen(item);
        });
      }
    }

    async draw(){
      await this.getFriends();
    }
}
