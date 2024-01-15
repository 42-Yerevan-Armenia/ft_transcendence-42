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
                <p>
                    Explore
                </p>
            </div>

            <nav className={Styles.nav}>
                <div>
                    <Link href={'/'} className={Styles.link} >
                        <CompasIcon />
                        <p>Home</p>
                    </Link>
                    <Link href={''} className={Styles.link}>
                        <MenIcon />
                        <p>Profile</p>
                    </Link>
                    <Link href={''} className={Styles.link}>
                        <GameIcon />
                        <p>Game</p>
                    </Link>
                    <Link href={''} className={Styles.link}>
                        <CupIcon/>
                        <p>Leaderboard</p>
                    </Link>
                    <Link href={''} className={Styles.link}>
                        <CameraIcon/>
                        <p>Live</p>
                    </Link>
                    <Link href={''} className={Styles.link}>
                        <Settings/>
                        <p>Settings</p>
                    </Link>
                </div>
                
                <UserBar />
            </nav>
        </div>
    )
}
