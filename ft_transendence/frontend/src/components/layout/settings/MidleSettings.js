import Image from 'next/image';
import Style from './MidleSettings.module.css';
import EditProfil from '@/components/icons/EditProfilName';
import EditProfilPhoto from '@/components/icons/EditProfilPhoto';
import ChangeWallpaper from '@/components/icons/ChangeWallpaper';
import GameMode from '@/components/icons/GameMode';
import {  useSelector } from 'react-redux';
import {ShowMidlle} from '@/redux/features/dataSlice';


export default function MidleSettings(){
    const {Settings} = useSelector(ShowMidlle);
    console.log("Settings == [" + Settings + "]");
    return (
        <div className={Style.MidleSettings} style={{ display: Settings ? "block" : "none" }}>
            <div className={Style.MidleSettingsProfil}>
                <p className={Style.MidleSettingsH}>Profile Settings</p>
                    <div className={Style.MidleSettingsHero}>
                        <Image src="/User.png" width={50} height={50} alt='User'
                                className={Style.MidleSettingImage}></Image>
                        <p>Zakariya Sidki</p>
                    </div>
                <div className={Style.MidleSettingsEdit}>
                    <div className={Style.MidleSettingsEditConteiner}>
                        <div className={Style.MidleSettingsBlocks}>
                            <div className={Style.MidleSettingsBlocksImage}>
                                <EditProfil x={25} y={25} />
                            </div>
                            <p className={Style.MidleSettingsBlocksP}>Edit Profile Name.</p>
                        </div>
                        <div className={Style.MidleSettingsBlocks}>
                            <div className={Style.MidleSettingsBlocksImage}>
                                <EditProfilPhoto  x={25} y={25}/>
                            </div>
                            <p className={Style.MidleSettingsBlocksP}>Edit Profile Photo.</p>
                        </div>
                        <div className={Style.MidleSettingsBlocks}>
                            <div className={Style.MidleSettingsBlocksImage}>
                                <ChangeWallpaper  x={25} y={25}/>
                            </div>
                            <p className={Style.MidleSettingsBlocksP}>Change Wallpaper.</p>
                        </div>
                        <div className={Style.MidleSettingsBlocks}>
                            <div className={Style.MidleSettingsBlocksImage}>
                                <GameMode  x={25} y={25} />
                            </div>
                            <p className={Style.MidleSettingsBlocksP}>Game Mode.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}