import Style from "../MidleCup.module.css";
import Image from 'next/image';

export default function MidleCubItem(){
    return (
        <div className={Style.MidleCubTableBody}>
            <div className={Style.MidleCubTableBodyNAme}>125</div>
            <div className={Style.MidleCubTd}>
                <Image src="/User2.png" width={40} height={40}
                alt="Users" className={Style.MidleCubTableImageBody}></Image>
                <div className={Style.MidleCubTableBodyNAme}>User2</div>
            </div>
            <div className={Style.MidleCubTableBodyNAme}>125</div>
            <div className={Style.MidleCubTableBodyNAme}>14</div>
            <div className={Style.MidleCubTableBodyNAme}>150</div>
        </div> 
    )
}