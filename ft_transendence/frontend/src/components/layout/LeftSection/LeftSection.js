import Image from 'next/image'
import Stule from "./LeftSection.module.css";
import NavMenu from "./navMenu/NavMenu"


export default function LeftSection(user=""){
    return (
        <div className={Stule.LeftSection}>
            <div className={Stule.menuIcon}>
                <Image src="/menuIcon.png" width={40} height={40} alt="menu"/>
                    {user !== "" ? <p className={Stule.dragonPong}>DragonPong</p> : ""}
            </div>
            <NavMenu />
        </div>
    )
}