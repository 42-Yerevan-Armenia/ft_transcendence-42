import Left from '@/components/icons/Left';
import Style from "./Next.module.css";

export default function Next(){
    return(
        <div className={Style.Next}>
            <div>
                Next
            </div>
            <div className={Style.NextLeft}>
                <Left/>
            </div>
        </div>
    )
}