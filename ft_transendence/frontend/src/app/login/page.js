import Style from './loginPage.module.css';
import Link from  'next/link';

export default function LoginPage(){
    return (
        <div className={Style.LoginPage}>
            <div className={Style.LoginPageConteiner}>
                <div className={Style.LoginPagePosition}>
                    <div className={Style.LoginPageText}>
                        <div className={Style.LoginPageH}>
                            <h2 className={Style.LoginPageH2}>Welcome Back</h2>
                            <p className={Style.LoginPageP}>Signin to your account</p>
                        </div>
                        <input placeholder='northstargroup@gmail.com' className={Style.LoginPageinput}></input>
                        <input placeholder='password' className={Style.password}></input>
                        <Link href="/" className={Style.LoginPageForgot}>Forgot Password?</Link>
                        <div className={Style.LoginPageContinue}>Signin</div>
                        <div className={Style.LoginPageOR}>
                            <div className={Style.Loginline}></div>OR<div className={Style.Loginline}></div>
                        </div>
                        <div className={Style.LoginPageContinueWith42}>
                            Continue with 42intra
                        </div>
                    </div>
                </div>        
            </div>
        </div>
    )
}
