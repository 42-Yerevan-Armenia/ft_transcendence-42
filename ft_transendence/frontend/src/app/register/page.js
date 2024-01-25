import Style from './RegisterPage.module.css';


export default function RegisterPage(){
    return (
        <div className={Style.RegisterPage}>
            <div className={Style.RegisterPageConteiner}>
                <div className={Style.RegisterPagePosition}>
                    <div className={Style.RegisterPageText}>
                        <div className={Style.RegisterPageH}>
                            <h2 className={Style.RegisterPageH2}>Welcome to
                                ft_transcendence</h2>
                            <p className={Style.RegisterPageP}>sign up with your email address or
                                42intra account.
                            </p>
                        </div>
                        <input placeholder='northstargroup@gmail.com' className={Style.RegisterPageinput}></input>
                        <div className={Style.RegisterPageContinue}>Continue with email</div>
                        <div className={Style.RegisterPageOR}>
                            <div className={Style.Registerline}></div>OR<div className={Style.Registerline}></div>
                        </div>
                        <div className={Style.RegisterPageContinueWith42}>
                            Continue with 42intra
                        </div>
                    </div>
                </div>        
            </div>
        </div>
    )
}

