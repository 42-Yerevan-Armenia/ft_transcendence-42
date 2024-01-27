import Style from "./MidleCup.module.css";
import Image from "next/image";
import MidleCubItem from "./MidleCubItem/MidleCubItem";
import Back from "./Back/Back";
import Next from "./Next/Next";

export default function MidleCub(){
    return(
        <div className={Style.MidleCub}>
            <div className={Style.MidleCubProfil}>
                <div className={Style.MidleCubHeroAll}>

                    <div className={Style.MidleCubHero}>
                        <Image src="/User.png" width={50} height={50} alt='User'
                            className={Style.MidleCubImage}></Image>
                        <div>
                            <p className={Style.MidleCubHeroP}>Zakariya Sidki</p>
                            <p className={Style.MidleCubHeroP}>#21</p>
                        </div>
                    </div>
                </div>


                <div className={Style.MidleCubEdit}>
                    <div className={Style.MidleCubConteinerTable}>
                        <div className={Style.MidleCubTable}>
                            <div className={Style.MidleCubTableName}>Rank</div>
                            <div className={Style.MidleCubTableName}>Username</div>
                            <div className={Style.MidleCubTableName}>Win</div>
                            <div className={Style.MidleCubTableName}>Lose</div>
                            <div className={Style.MidleCubTableName}>Matches</div>
                        </div>
                        <MidleCubItem/>
                        <MidleCubItem/>
                        <MidleCubItem/>
                        <MidleCubItem/>
                        <MidleCubItem/>
                        <MidleCubItem/>
                    </div>
                </div>
                <div className={Style.MidleCubList}>
                    <Back/>
                    <Next/>
                </div>
            </div>
        </div>
    )
}