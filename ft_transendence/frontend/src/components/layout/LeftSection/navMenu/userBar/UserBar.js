import Image from 'next/image';
import Styles from './UserBar.module.css';
import Exit from "@/components/icons/Exit"

export default function UserBar(User={}){
    return (
        <div className={Styles.User}>
            <div className={Styles.Onlain}>
                <Image src="/User.png" width={50} height={50} alt="User" className={Styles.Image}/>
                <div className={User ? Styles.On : Styles.Off} ></div>
            </div>
            <div className={Styles.Info}>
                <div className={Styles.InfoText}>
                    <h5 className={Styles.Text}>ZaAk Sidki</h5>
                    <h6 className={Styles.Text}>zsidki</h6>
                    <div className={Styles.IconExit}>
                        <Exit />
                    </div>
                </div>
            </div>
        </div>
    )
}