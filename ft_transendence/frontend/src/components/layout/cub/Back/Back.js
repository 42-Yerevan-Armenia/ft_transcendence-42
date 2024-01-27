import Left from '@/components/icons/Left';
import Style from "./Back.module.css";

export default function Back(){
    return(
        <div className={Style.Back}>
            <div>
                <Left/>
            </div>
            <div>
                back
            </div>
        </div>
    )
}