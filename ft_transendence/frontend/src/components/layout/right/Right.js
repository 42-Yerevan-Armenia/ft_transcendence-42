import Stule from './Right.module.css';
import Link from  'next/link';


export default function Right(){
    return(
        <div className={Stule.Rightsection} >
            <div className={Stule.Rightsignin}>
                <Link href={'/login'} className={Stule.RightsigninButton}>
                    Sign in
                </Link>
            </div>
            <div className={Stule.RightMidle}>
                <div className={Stule.RightMidLepoint}></div>
                <div>OR</div>
                <div className={Stule.RightMidLepoint}></div>
            </div>
            <div className={Stule.Rightsignup} >
                <Link href={'/register'} className={Stule.RightgninupButton} >
                    Sign up
                </Link>
                
            </div>
        </div>
    )
}