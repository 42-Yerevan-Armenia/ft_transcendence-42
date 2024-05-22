////debugger
class MidleHistoryGame extends HtmlElement{
    constructor(){
        super(".MidleHistoryGame");
        this._style.display = "none";
        this._fullHistory = {};
    };

    getConetntFullHistoryContainerTable() {
        console.log("barev");
        return `
        <div class="FullHistoryContainerTable">
                <div class="FullHistoryTable">
                    <div class="FullHistoryTableElems">id</div>
                    <div class="FullHistoryTableElems">Player list</div>
                    <div class="FullHistoryTableElems">Preference</div>
                    <div class="FullHistoryTableElems">Points</div>
                    <div class="FullHistoryTableElems">Matches</div>
                </div>
                <div class="FullHistoryContainerTableALL" id="FullHistoryContainerTableALLId"></div>
            </div>
        `
    }
    
    getContentFullHistoryTableBodyUser(data) {
        // debugger;
        return `
        <div class="FullHistoryTableBodyUser" id="FullHistoryTableBodyUserId:${data.opponent_id}">
            <div class="FullHistoryTableBody">
                <div><p>${data.opponent_id}</p></div>
                <div class="FullHistoryPlayerList">
                    <div class="imgInsideDiv">
                        <img src=data:image/png;base64,${data.image} width="40" height="40"
                        alt="Users" class="FullHistoryTableImageBody"></img>
                    </div>
                    <p>${data.nickname}</p>
                </div>
                <div><p>${data.gamemode}</p></div>
                <div><p>${data.points}</p></div>
                <div><p>${data.matches}</p></div>
                <div id="FullHistoryTableBodyMoreDiv">
                    <button class="FullHistoryTableBodyMembers" id="FullHistoryTableBodyMore:${data.opponent_id}"><img src="./public/ButtonU.png" class="FullHistoryTableBodyNAmeImg"/></button>
                </div>
            </div>
        </div>
        `
                    // <img src="./public/ButtonU.png" class="FullHistoryTableBodyNAmeImg"></img>
    }
    
    getConetntFullHistoryTableBodyContainerPlayedGames(data) {
        return `
            <div class="FullHistoryTablePlayedGames">
                <div>data</div>
                <div>Win</div>
                <div>Lose</div>
                <div>gamemode</div>
            </div>
        `
    }

    getConetntFullHistoryTableBodyPlayedGamesContent(data) {
        return `
        <div class="FullHistoryTableBodyPlayedGamesContent">
            <div>${data.date}</div>
            <div>${data.win}</div>
            <div>${data.lose}</div>
            <div>${data.gamemode}</div>
        </div>
        `
    }

    async listUsers(){
        this._classname.innerHTML = "";
        this._classname.innerHTML = this.getConetntFullHistoryContainerTable();
        const historyPlayers = document.querySelector("#FullHistoryContainerTableALLId");

        const history = await getFetchRequest("api/v1/history/" + User._Id);

        console.log("history = ", history);
        if (history && history.state && history.message && history.message.history)
        {
            const data = history.message.history;
            // this._data = history.message.history;
            data.forEach(e => {
                const opponent_id = e.opponent_id;
                const div = fromHTML(this.getContentFullHistoryTableBodyUser(e));
                historyPlayers.append(div);
                const moreButton = document.getElementById("FullHistoryTableBodyMore:" + opponent_id);
                moreButton.pressed = false;
                this._fullHistory[opponent_id] = e.full_history;
                moreButton.addEventListener("click", () => {
                    console.log("event");
                    const userContext = document.getElementById("FullHistoryTableBodyUserId:" + opponent_id);
                    
                    while (userContext.children.length > 1) {
                        userContext.removeChild(userContext.lastChild);
                    }

                    if (moreButton.pressed) {

                        moreButton.innerHTML = "<img src='./public/Buttonu.png' class='FullHistoryTableBodyNAmeImg'/>";
                    } else {

                        const fullHistory = this._fullHistory[moreButton.id.split(":").at(-1)]
                        moreButton.innerHTML = "<img src='./public/ButtonD.png' class='FullHistoryTableBodyNAmeImg'/>";
                        
                        fullHistory?.forEach((e) => {
                            
                            
                            console.log("e = ", e);
                            userContext.append(fromHTML(this.getConetntFullHistoryTableBodyContainerPlayedGames()));
                            userContext.append(fromHTML(this.getConetntFullHistoryTableBodyPlayedGamesContent(e)));
                        })
                    }

                    moreButton.pressed = !moreButton.pressed;
                })
            });

        }
    }
    async draw(){
        // debugger
        await this.listUsers();
    }
}


function fromHTML(html, trim = true) {
    // Process the HTML string.
    html = trim ? html.trim() : html;
    if (!html) return null;
  
    // Then set up a new template element.
    const template = document.createElement('template');
    template.innerHTML = html;
    const result = template.content.children;
  
    // Then return either an HTMLElement or HTMLCollection,
    // based on whether the input HTML had one or more roots.
    if (result.length === 1) return result[0];
    return result;
  }