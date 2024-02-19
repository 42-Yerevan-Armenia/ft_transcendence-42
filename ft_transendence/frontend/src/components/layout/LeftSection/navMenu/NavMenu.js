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
import { useDispatch } from 'react-redux';
import {MiddleShow} from '@/redux/features/dataSlice';




export default function NavMenu(user=""){
    function HomeMidle(){
        
    }

    const dispatch = useDispatch();
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
                    <div className={Styles.link} onClick={()=>{
                        dispatch(MiddleShow({homeConteiner: true}))
                        }} id="CompasIcon">
                        <CompasIcon />
                        <p className={Styles.navLinkP}>Home</p>
                    </div>

                    <div onClick={()=>{
                        dispatch(MiddleShow({Profile: true}))
                        }}
                        className={Styles.link} id="MenIcon">
                        <MenIcon />
                        <p className={Styles.navLinkP}>Profile</p>
                    </div>

                    <div onClick={()=>{
                        dispatch(MiddleShow({Game: true}))
                        }} className={Styles.link}>
                        <GameIcon />
                        <p className={Styles.navLinkP}>Game</p>
                    </div>

                    <div onClick={()=>{
                        dispatch(MiddleShow({Leaderboard: true}))
                        }} className={Styles.link}>
                        <CupIcon/>
                        <p className={Styles.navLinkP}>Leaderboard</p>
                    </div>

                    <div onClick={()=>{
                        dispatch(MiddleShow({ Live: true }))
                        }}  className={Styles.link}>
                        <CameraIcon/>
                        <p className={Styles.navLinkP}>Live</p>
                    </div>

                    <div onClick={()=>{
                        dispatch(MiddleShow({ Settings: true }))
                        }}  className={Styles.link}>
                        <Settings/>
                        <p className={Styles.navLinkP}>Settings</p>
                    </div>

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
