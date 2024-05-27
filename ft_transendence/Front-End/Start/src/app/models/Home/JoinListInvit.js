class JoinListInvit extends HtmlElement{
    constructor(){
        super(".JoinListInvite")
        this._style.display = "none";
    };
    data = "";
    _ItemButtonAll = document.querySelectorAll(".JoinListInviteClass");
/* <tr class="JoinListInvitetbodyTr">
    1 <td class="JoinListInvitetbodyTd">1</td>
    2 <td class="JoinListInvitetbodyTd">
        <img src="./public/men.png" width="30px" height="30px" alt="User" class="JoinListInviteimg"></td>
    3 <td class="JoinListInvitetbodyTd">User1</td>
    4 <td class="JoinListInvitetbodyTd">Classic</td>
    5 <td class="JoinListInvitetbodyTd">123456</td>
    6 <td class="JoinListInvitetbodyTd"><button class="JoinListInviteClass" id="JoinListInviteid">Invite</button></td>
</tr> */
    JoinListInvitetbodyTr(Item){
        //////// debugger
        const tr = document.createElement("tr");
        tr.setAttribute("class", "JoinListInvitetbodyTr");
        const td1 = document.createElement("td");
        td1.setAttribute("class", "JoinListInvitetbodyTd")
        td1.innerHTML = Item.id;

        const td2 = document.createElement("td");
        td2.setAttribute("class", "JoinListInvitetbodyTd")
        
        const tdimg = document.createElement("img");
        tdimg.setAttribute("class", "JoinListInviteimg");
        tdimg.setAttribute("height", "30px");
        tdimg.setAttribute("width", "30px");
        tdimg.setAttribute("alt", "User");
        tdimg.setAttribute("src", `data:image/png;base64,${Item.image}`);
        td2.appendChild(tdimg);

        const td3 = document.createElement("td");
        td3.setAttribute("class", "JoinListInvitetbodyTd");
        td3.innerHTML = Item.nickname;
        
        const td4 = document.createElement("td");
        td4.setAttribute("class", "JoinListInvitetbodyTd");
        td4.innerHTML  = Item.gamemode
        
        const td5 = document.createElement("td");
        td5.setAttribute("class", "JoinListInvitetbodyTd");
        td5.innerHTML = Item.points;

        const td6 = document.createElement("td");
        td6.setAttribute("class", "JoinListInvitetbodyTd");
        const td6button = document.createElement("button");
        td6button.setAttribute("class", "JoinListInviteClass");
        td6button.setAttribute("id", "JoinListInviteid :" + Item.id);
        td6button.innerHTML = "Invite";
        td6.appendChild(td6button);
        
        tr.appendChild(td1)
        tr.appendChild(td2)
        tr.appendChild(td3)
        tr.appendChild(td4)
        tr.appendChild(td5)
        tr.appendChild(td6)

        const table = document.querySelector(".JoinListInvitetbody")
        table.appendChild(tr);
    }
    async setTableInvit() {
        document.querySelector(".JoinListInvitetbody").innerHTML = "";
       const data = await getFetchRequest("api/v1/waitingroom/" + User._Id);
       if (!data.state)
        return ;
        // {'id':1, 'nickname':"dasdas", 'image':"", 'gamemode':"classic", 'points':123144}
       data.message.sort((e,e1)=>e.id < e1.id).forEach(async item => {
           await this.JoinListInvitetbodyTr(item);
       });

       const buttons =  document.querySelectorAll(".JoinListInviteClass");;
    //Iterate over each button and set event listener invit
    buttons.forEach(async button => {
        button.addEventListener("click", async function(e) {
                const clientid = e.target.id.slice(e.target.id.lastIndexOf(':') + 1);
                const sendFrend = {
                    opponent_id : clientid
                }
                const res = await putRequest("POST", "api/v1/invite/" +User._Id, sendFrend);
                if (!res || !res.state) {
                    alert("prevus you should create join list item");
                    return ;
                }
            })
        })
        this.data = data;
    }

    async draw(){
        await this.setTableInvit();
    }
}
