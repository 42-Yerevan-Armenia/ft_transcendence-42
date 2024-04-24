class AccountUser extends HtmlElement{
    constructor(){
        super(".AccountMidle");
        this.State = {
            _Id:0,
            _Image:"",
            _Name:"",
            _Nickname:"",
        };
    }
    _AccountMidleHeaderToInvit1 = document.querySelector("#AccountMidleHeaderToInvit1");
    _AccountMidleHeaderToInvit2 = document.querySelector("#AccountMidleHeaderToInvit2");
/* <div class="AccountMidleFooterUser">
    <img src="./public/Grup2.png" alt="Friends" class="AccountMidleFooterUserImage">
    <p class="AccountMidleFooterUserName">User1</p>
</div> */
    profilHeader(){
      document.querySelector("#AccountMidleHeaderMainAvatarImage").src = `data:image/png;base64,${this.State._Image}`;
      document.querySelector(".AccountMidleHeaderMainDataName").innerHTML = this.State._Name;
      document.querySelector(".AccountMidleHeaderMainDataNickName").innerHTML = this.State._Nickname;
      const AccountMidleFooterDiv  = document.querySelector(".AccountMidleFooterDiv");
      AccountMidleFooterDiv.innerHTML = ""
    }

    frendsdrawScreen(friend){
      const divProf = document.createElement("div");
      divProf.setAttribute("class", "AccountMidleFooterUser");
      const img = document.createElement("img");
      img.setAttribute("class","AccountMidleFooterUserImage");
      img.setAttribute("alt", "Friends");
      img.setAttribute("id", `Friends${friend.id}id`);
      img.setAttribute("src", `data:image/png;base64,${friend.image}`);
      const p = document.createElement("div");
      p.setAttribute("class", "AccountMidleFooterUserName");
      p.innerHTML = friend.nickname;
      divProf.appendChild(img);
      divProf.appendChild(p);

      const AccountMidleFooterDiv  = document.querySelector(".AccountMidleFooterDiv");
      AccountMidleFooterDiv.appendChild(divProf);
    }

    async getFriends(){
       this.profilHeader();

      const friends = await getFetchRequest("api/v1/friendlist/" + this.State._Id);
      if (friends && friends.state)
      {
        friends.message.friends.forEach(async item => {
            this.frendsdrawScreen(item);
        });
      }
    }

    async draw(){
      await this.getFriends();
    }
}
