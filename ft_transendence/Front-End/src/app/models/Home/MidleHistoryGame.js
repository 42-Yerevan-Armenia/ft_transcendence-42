////debugger
class MidleHistoryGame extends HtmlElement{
    constructor(){
        super(".MidleHistoryGame");
        this._style.display = "none";
        this.FullHistory = this.createFullHistory();
        this._classname.appendChild(this.FullHistory);
    };
    createFullHistoryTableBodyContainerPlayedGames(dateContent, winContent, loseContent, modeContent)
    {
        // Create outer container div
        const outerContainer = document.createElement('div');
        outerContainer.classList.add('FullHistoryTableBodyContainerPlayedGames');

        // Create inner container div for played games
        const innerContainer = document.createElement('div');
        innerContainer.classList.add('FullHistoryTablePlayedGames');

        // Create inner divs for date, win, lose, and mode
        const tableHeader = ['Date', 'Win', 'Lose', 'Mode'];

        for(let i = 0; i < tableHeader.length; i++) {
            let a = document.createElement('div');
            a.textContent = tableHeader[i];
            innerContainer.appendChild(a);
        }
        
        // Create inner divs for game content
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('FullHistoryTableBodyPlayedGamesContent');

        const dateContentDiv = document.createElement('div');
        dateContentDiv.textContent = dateContent;

        const winContentDiv = document.createElement('div');
        winContentDiv.textContent = winContent;

        const loseContentDiv = document.createElement('div');
        loseContentDiv.textContent = loseContent;

        const modeContentDiv = document.createElement('div');
        modeContentDiv.textContent = modeContent;

        // Append date, win, lose, and mode content divs to content container div
        contentContainer.appendChild(dateContentDiv);
        contentContainer.appendChild(winContentDiv);
        contentContainer.appendChild(loseContentDiv);
        contentContainer.appendChild(modeContentDiv);

        // Append inner containers to outer container
        outerContainer.appendChild(innerContainer);
        outerContainer.appendChild(contentContainer);

        // Append outer container to the document body or any desired parent element
        // document.body.appendChild(outerContainer);
        return (outerContainer);

    }


    createFullHistoryTableBodyUser(id, name, img, preference, points, matches) {
        // Create elements
        ////debugger
        const divFullHistoryTableBodyUser = document.createElement("div");
        divFullHistoryTableBodyUser.classList.add("FullHistoryTableBodyUser");
        divFullHistoryTableBodyUser.id = "FullHistoryTableBodyUserId";

        const divFullHistoryTableBody = document.createElement("div");
        divFullHistoryTableBody.classList.add("FullHistoryTableBody");

        const divNumber = document.createElement("div");
        divNumber.innerHTML = "<p>" + id + "</p>";

        const divFullHistoryPlayerList = document.createElement("div");
        divFullHistoryPlayerList.classList.add("FullHistoryPlayerList");

        const divImgInsideDiv = document.createElement("div");
        divImgInsideDiv.classList.add("imgInsideDiv");

        const imgUser = document.createElement("img");
        imgUser.src = "./public/User2.png";  // TODO img
        imgUser.width = "40";
        imgUser.height = "40";
        imgUser.alt = "Users";
        imgUser.classList.add("FullHistoryTableImageBody");

        const pName = document.createElement("p");
        pName.textContent = name;

        const divPreference = document.createElement("div");
        divPreference.innerHTML = "<p>" + preference + "</p>";

        const divNumber1 = document.createElement("div");
        divNumber1.innerHTML = "<p>" + points + " </p>";

        const divNumber2 = document.createElement("div");
        divNumber2.innerHTML = "<p>" + matches + "</p>";

        const divFullHistoryTableBodyMoreDiv = document.createElement("div");
        divFullHistoryTableBodyMoreDiv.id = "FullHistoryTableBodyMoreDiv";

        const btnFullHistoryTableBodyMore = document.createElement("button");
        btnFullHistoryTableBodyMore.classList.add("FullHistoryTableBodyMembers");
        btnFullHistoryTableBodyMore.id = "FullHistoryTableBodyMore";

        const imgButtonU = document.createElement("img");
        imgButtonU.src = "./public/ButtonU.png";
        imgButtonU.classList.add("FullHistoryTableBodyNAmeImg");

        // Append elements
        divFullHistoryTableBody.appendChild(divNumber);
        divImgInsideDiv.appendChild(imgUser);
        divFullHistoryPlayerList.appendChild(divImgInsideDiv);
        divFullHistoryPlayerList.appendChild(pName);
        divFullHistoryTableBody.appendChild(divFullHistoryPlayerList);
        divFullHistoryTableBody.appendChild(divPreference);
        divFullHistoryTableBody.appendChild(divNumber1);
        divFullHistoryTableBody.appendChild(divNumber2);
        divFullHistoryTableBodyMoreDiv.appendChild(btnFullHistoryTableBodyMore);
        btnFullHistoryTableBodyMore.appendChild(imgButtonU);

        divFullHistoryTableBody.appendChild(divFullHistoryTableBodyMoreDiv);
        divFullHistoryTableBodyUser.appendChild(divFullHistoryTableBody);

        // Append the created structure to the document body or any other desired parent element
        // document.body.appendChild(divFullHistoryTableBodyUser);
        return (divFullHistoryTableBodyUser);
    }


    createFullHistory () {
        // Create elements
        const divFullHistory = document.createElement("div");
        divFullHistory.classList.add("FullHistory");
        
        const divFullHistoryProfil = document.createElement("div");
        divFullHistoryProfil.classList.add("FullHistoryProfil");
        
        const divFullHistoryHeroAll = document.createElement("div");
        divFullHistoryHeroAll.classList.add("FullHistoryHeroAll");
        
        const divFullHistoryHero = document.createElement("div");
        divFullHistoryHero.classList.add("FullHistoryHero");
        
        const divFullHistoryHeroDiv = document.createElement("div");
        divFullHistoryHeroDiv.classList.add("FullHistoryHeroDiv");
        
        const divFullHistoryEdit = document.createElement("div");
        divFullHistoryEdit.classList.add("FullHistoryEdit");
        
        const divFullHistoryContainerTable = document.createElement("div");
        divFullHistoryContainerTable.classList.add("FullHistoryContainerTable");
        
        const divFullHistoryTable = document.createElement("div");
        divFullHistoryTable.classList.add("FullHistoryTable");
        
        const divId = document.createElement("div");
        divId.classList.add("FullHistoryTableElems");
        divId.textContent = "id";
        
        const divPlayerList = document.createElement("div");
        divPlayerList.classList.add("FullHistoryTableElems");
        divPlayerList.textContent = "Player list";
        
        const divPreference = document.createElement("div");
        divPreference.classList.add("FullHistoryTableElems");
        divPreference.textContent = "Preference";
        
        const divPoints = document.createElement("div");
        divPoints.classList.add("FullHistoryTableElems");
        divPoints.textContent = "Points";
        
        const divMatches = document.createElement("div");
        divMatches.classList.add("FullHistoryTableElems");
        divMatches.textContent = "Matches";
        
        const divFullHistoryContainerTableAll = document.createElement("div");
        divFullHistoryContainerTableAll.classList.add("FullHistoryContainerTableALL");
        
        // Append elements
        divFullHistoryTable.appendChild(divId);
        divFullHistoryTable.appendChild(divPlayerList);
        divFullHistoryTable.appendChild(divPreference);
        divFullHistoryTable.appendChild(divPoints);
        divFullHistoryTable.appendChild(divMatches);
        
        divFullHistoryContainerTable.appendChild(divFullHistoryTable);
        divFullHistoryContainerTable.appendChild(divFullHistoryContainerTableAll);
        
        divFullHistoryEdit.appendChild(divFullHistoryContainerTable);
        
        divFullHistoryHero.appendChild(divFullHistoryHeroDiv);
        divFullHistoryHeroAll.appendChild(divFullHistoryHero);
        
        divFullHistoryProfil.appendChild(divFullHistoryHeroAll);
        divFullHistoryProfil.appendChild(divFullHistoryEdit);
        
        divFullHistory.appendChild(divFullHistoryProfil);
        
        // Append the created structure to the document body or any other desired parent element
        return (divFullHistory);
    }
    appandDiv(user){
        const FullHistoryTableBodyUser = this.createFullHistoryTableBodyUser(1);
        const FullHistoryTableBodyUser1 = this.createFullHistoryTableBodyUser(2);
        // FullHistory.appendChild(FullHistoryTableBodyUser);
        this.FullHistory.children[0].appendChild(FullHistoryTableBodyUser);
        this.FullHistory.children[0].appendChild(FullHistoryTableBodyUser1);
        FullHistoryTableBodyUser1.appendChild(this.createFullHistoryTableBodyContainerPlayedGames("0", "2", "3", "4"));
        FullHistoryTableBodyUser1.appendChild(this.createFullHistoryTableBodyContainerPlayedGames("0", "2", "3", "4"));
        // document.getElementsByClassName("FullHistoryProfil").appendChild(FullHistoryTableBodyUser);
        FullHistoryTableBodyUser.appendChild(this.createFullHistoryTableBodyContainerPlayedGames("0", "2", "3", "4"));
        document.body.appendChild(this.FullHistory);
    }
    async listUsers(){
        const history = await getFetchRequest("api/v1/joinlist/" + User._Id);

        if (history && history.state && history.message.game_rooms)
        {
            //history.message
            history?.message?.game_rooms?.forEach(e => {
                this.appandDiv(e);
            });
        }
    }
    async draw(){
        await this.listUsers();
    }
}

   
    
    

    
    // document.getElementById("FullHistoryTableBodyUserId").appendChild(createFullHistoryTableBodyContainerPlayedGames("0", "2", "3", "4"));
    