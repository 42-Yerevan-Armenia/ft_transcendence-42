import Style from './ConfirmPage.module.css';
import Link from  'next/link';

export default function ConfirmPage(){
    return (
        <div className={Style.ConfirmPage}>
            <div className={Style.ConfirmPageConteiner}>
                <div className={Style.ConfirmPagePosition}>
                    <div className={Style.ConfirmPageText}>
                        <div className={Style.ConfirmPageH}>
                            <h2 className={Style.ConfirmPageH2}>Confirm your Email</h2>
                            <p className={Style.ConfirmPageP}>We sent to your Email Code of numbers,
                                please enter them</p>
                        </div>
                        
                        <div className={Style.ConfirmPageCode}>
                            <input className={Style.password}></input>
                            <input className={Style.password}></input>
                            <input className={Style.password}></input>
                            <input className={Style.password}></input>
                            <input className={Style.password}></input>
                        </div>

                        <div className={Style.ConfirmPageContinue}>Signin</div>

                    </div>
                </div>        
            </div>
        </div>
    )
}

