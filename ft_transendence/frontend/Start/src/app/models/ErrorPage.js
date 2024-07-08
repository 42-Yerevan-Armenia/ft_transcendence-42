// Home Page
class ErrorPage extends HtmlElement {
    drowError(){
        return`
        <h1 style="background:red"> ERROR :PAGE IS NOT CORRECT </h1>
        `
    }
    async draw() {
        const body = document.querySelector(".bodyClassAllForGame");
        body.innerHTML = this.drowError();
    }
  }
  