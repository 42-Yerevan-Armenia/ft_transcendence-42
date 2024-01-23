import Stule from './Right.module.css';

export default function Right(){
    return(
        <div className={Stule.Rightsection}>
            <div className={Stule.Rightsignin}>
                <div className={Stule.RightsigninButton}>
                    Sign in
                </div>
            </div>
            <div className={Stule.RightMidle}>
                <div className={Stule.RightMidLepoint}></div>
                <div>OR</div>
                <div className={Stule.RightMidLepoint}></div>
            </div>
            <div className={Stule.Rightsignup}>
                <div className={Stule.RightgninupButton}>
                    Sign up
                </div>
            </div>
        </div>
    )
}