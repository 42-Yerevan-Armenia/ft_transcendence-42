import Style from "./Password.module.css";

export default function Password(){
    return (
        <div className={Style.PasswordPage}>
            <div className={Style.PasswordPageConteiner}>
                <div className={Style.PasswordPagePosition}>
                    <div className={Style.PasswordPageText}>
                        <div className={Style.PasswordPageH}>
                            <h2 className={Style.PasswordPageH2}>Password</h2>
                            <p className={Style.PasswordPageP}>Enter your new password</p>
                        </div>
                        <input placeholder='New password' className={Style.PasswordPageinput}></input>

                        <input placeholder='Repeat password' className={Style.PasswordPageinput}></input>

                        <div className={Style.PasswordPageContinue}>Continue</div>
                    </div>
                </div>        
            </div>
        </div>
    )
}