import Style from "./Signup.module.css";

export default function Signup(){
    return (
        <div className={Style.SignupPage}>
            <div className={Style.SignupPageConteiner}>
                <div className={Style.SignupPagePosition}>
                    <div className={Style.SignupPageText}>
                        <div className={Style.SignupPageH}>
                            <h2 className={Style.SignupPageH2}>Registration</h2>
                            <p className={Style.SignupPageP}>Enter your new Signup</p>
                        </div>
                        <div className={Style.SignupPageinputDiv}>
                            <input placeholder='Nickname' className={Style.SignupPageinput}></input>
                            <div className={Style.SignupPageinputDivErrorNickname}></div>
                        </div>
                        <div className={Style.SignupPageinputDiv}>
                            <input placeholder='Name' className={Style.SignupPageinput}></input>
                            <div className={Style.SignupPageinputDivErrorName}></div>
                        </div>
                        <div className={Style.SignupPageinputDiv}>
                            <input placeholder='New password' className={Style.SignupPageinput}></input>
                            <div className={Style.SignupPageinputDivError}></div>
                        </div>
                        <div className={Style.SignupPageinputDiv}>
                            <input placeholder='Replay password' className={Style.SignupPageinput}></input>
                            <div className={Style.SignupPageinputDivErrorReplay}></div>
                        </div>

                        <div className={Style.SignupPageContinue}>Continue</div>
                    </div>
                </div>        
            </div>
        </div>
    )
}
