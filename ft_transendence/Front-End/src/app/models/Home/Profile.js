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
    profilHeader(){
      debugger
      document.querySelector("#ProfileMidleHeaderMainAvatarImage").src = `data:image/png;base64,${User._Image}`;
      document.querySelector(".ProfileMidleHeaderMainDataName").innerHTML = User._Name;
      document.querySelector(".ProfileMidleHeaderMainDataNickName").innerHTML = User._Nickname;
      const ProfileMidleFooterDiv  = document.querySelector(".ProfileMidleFooterDiv");
      ProfileMidleFooterDiv.innerHTML = ""
    }

    frendsdrawScreen(friend){
      debugger
      const divProf = document.createElement("div");
      divProf.setAttribute("class", "ProfileMidleFooterUser");
      const img = document.createElement("img");
      img.setAttribute("class","ProfileMidleFooterUserImage");
      img.setAttribute("alt", "Friends");
      img.setAttribute("id", `Friends${friend.id}id`);
      img.setAttribute("src", `data:image/png;base64,${friend.image}`);
      const p = document.createElement("div");
      p.setAttribute("class", "ProfileMidleFooterUserName");
      p.innerHTML = friend.nickname;
      divProf.appendChild(img);
      divProf.appendChild(p);

      const ProfileMidleFooterDiv  = document.querySelector(".ProfileMidleFooterDiv");
      ProfileMidleFooterDiv.appendChild(divProf);
    }
    async getFriends(){
      debugger
      await this.profilHeader();

      const friends = await getFetchRequest("api/v1/friendlist/" + User._Id);
      if (friends && friends.state)
      {
        friends.message.friends.forEach(async item => {
           await this.frendsdrawScreen(item);
        });
      }
    }

    async draw(){
      await this.getFriends();
    }
}
