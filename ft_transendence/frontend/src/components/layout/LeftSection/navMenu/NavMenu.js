import Link from  'next/link';
import Threepoint from '@/components/icons/ThreePoint';
import Styles from './navMenu.module.css';
import CompasIcon from '../../../icons/CompasIcon';
import MenIcon from "../../../icons/MenIcon";
import GameIcon from "../../../icons/GameIcon";
import CupIcon from "../../../icons/CupIcon";
import CameraIcon from "../../../icons/CameraIcon";
import Settings from "../../../icons/Settings";
import UserBar from "./userBar/UserBar"

export default function NavMenu(user=""){
    return(
        <div className={Styles.NamvMenu}>
            <div className={Styles.Explore}>
                <div className={Styles.Threepoint}>
                    <Threepoint/>
                </div>
                <p className={Styles.navLinkP}>
                    Explore
                </p>
            </div>

            <nav className={Styles.nav}>
                <div>
                    <Link href={'/'} className={Styles.link} >
                        <CompasIcon />
                        <p className={Styles.navLinkP}>Home</p>
                    </Link>
                    <Link href={''} className={Styles.link}>
                        <MenIcon />
                        <p className={Styles.navLinkP}>Profile</p>
                    </Link>
                    <Link href={''} className={Styles.link}>
                        <GameIcon />
                        <p className={Styles.navLinkP}>Game</p>
                    </Link>
                    <Link href={''} className={Styles.link}>
                        <CupIcon/>
                        <p className={Styles.navLinkP}>Leaderboard</p>
                    </Link>
                    <Link href={''} className={Styles.link}>
                        <CameraIcon/>
                        <p className={Styles.navLinkP}>Live</p>
                    </Link>
                    <Link href={''} className={Styles.link}>
                        <Settings/>
                        <p className={Styles.navLinkP}>Settings</p>
                    </Link>
                    <div className={Styles.NavSigninSignout}>
                        <div className={Styles.NavSignin}>
                            SignIn
                        </div>
                        <div className={Styles.NavSignUp}>
                            SignUp
                        </div>
                    </div>
                </div>
                <UserBar />
            </nav>
        </div>
    )
}
