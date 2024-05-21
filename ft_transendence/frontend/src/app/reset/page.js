import Style from './resetPage.module.css';

export default function ResetPage(){
    return (
        <div className={Style.ResetPage}>
            <div className={Style.ResetPageConteiner}>
                <div className={Style.ResetPagePosition}>
                    <div className={Style.ResetPageText}>
                        <div className={Style.ResetPageH}>
                            <h2 className={Style.ResetPageH2}>Reset Password</h2>
                            <p className={Style.ResetPageP}>Enter your email address <br/> for reset password</p>
                        </div>
                        <input placeholder='Enter your email' className={Style.ResetPageinput}></input>
                        <div className={Style.ResetPageContinue}>Confirm reset</div>
                    </div>
                </div>        
            </div>
        </div>
    )
}
