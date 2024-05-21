////debugger
class MidleHistoryGame extends HtmlElement{
    constructor(){
        super(".MidleHistoryGame");
        this._style.display = "none";

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
                    <p>name</p>
                </div>
                <div><p>Classic /Hard Easy</p></div>
                <div><p>${data.oponent_points}</p></div>
                <div><p>${data.mathces}</p></div>
                <div id="FullHistoryTableBodyMoreDiv">
                    <button class="FullHistoryTableBodyMembers" id="FullHistoryTableBodyMore:${data.opponent_id}"><img src="./public/ButtonU.png" class="FullHistoryTableBodyNAmeImg"/></button>
                </div>
            </div>
        </div>
        `
    }
    
    getConetntFullHistoryTableBodyContainerPlayedGames(data) {
        return `
        <div class="FullHistoryTableBodyContainerPlayedGames">
            <div class="FullHistoryTablePlayedGames">
                    <div>data</div>
                    <div>Win</div>
                    <div>Lose</div>
                    <div>gamemode</div>
            </div>
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
        debugger;

        if (history && history.state && history.message)
        {
            history?.message?.forEach(e => {
                historyPlayers.innerHTML += this.getContentFullHistoryTableBodyUser(e);
                historyPlayers.innerHTML += this.getConetntFullHistoryTableBodyContainerPlayedGames({})

                const FullHistoryTableBodyUserId = document.querySelector(`#FullHistoryTableBodyUserId${e.opponent_id} .FullHistoryTableBodyContainerPlayedGames`)
                FullHistoryTableBodyUserId.innerHTML += this.getConetntFullHistoryTableBodyPlayedGamesContent(e)

            });
        }
    }
    async draw(){
        // debugger
        await this.listUsers();
    }
}