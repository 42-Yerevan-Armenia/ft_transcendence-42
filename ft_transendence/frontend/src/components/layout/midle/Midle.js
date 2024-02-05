import Image from "next/image"
import Stule from "./Midle.module.css";
import PlayIcon from '@/components/icons/PlayIcon'


export default function Midle(){
    

    return (
            <div className={Stule.midle} >
                <div className={Stule.divpingPong}>
                    <Image src="/pingPong.png" width={560} height={240} 
                            alt="pingPong"  className={Stule.pingPong}/>
                </div>

                
                <div className={Stule.midleplayers}>
                    <div className={Stule.topplayers}>
                        <h3 className={Stule.top}>TOP PLAYERS</h3>
                        <div className={Stule.players}>
                            <div className={Stule.item}>
                                <Image src="/User.png" width={60} height={60}
                                    alt="user" className={Stule.imag}></Image>
                                <h6 className={Stule.itemName}>User.png</h6>
                                <p className={Stule.itemP}>123456 points</p>
                            </div>
                            <div className={Stule.item}>
                                <Image src="/User.png" width={60} height={60}
                                    alt="user" className={Stule.imag}></Image>
                                <h6 className={Stule.itemName}>User.png</h6>
                                <p className={Stule.itemP}>123456 points</p>
                            </div>
                            <div className={Stule.item}>
                                <Image src="/User.png" width={60} height={60}
                                    alt="user" className={Stule.imag}></Image>
                                <h6 className={Stule.itemName}>User.png</h6>
                                <p className={Stule.itemP}>123456 points</p>
                            </div>
                            <div className={Stule.item}>
                                <Image src="/User.png" width={60} height={60}
                                    alt="user" className={Stule.imag}></Image>
                                <h6 className={Stule.itemName}>User.png</h6>
                                <p className={Stule.itemP}>123456 points</p>
                            </div>
                            <div className={Stule.item}>
                                <Image src="/User.png" width={60} height={60}
                                    alt="user" className={Stule.imag}></Image>
                                <h6 className={Stule.itemName}>User.png</h6>
                                <p className={Stule.itemP}>123456 points</p>
                            </div>
 
                        </div>
                    </div>
                </div>


                <div className={Stule.live}>
                    <div className={Stule.liveMen}>
                        <Image src="/men.png" width={50}
                             height={150}
                             alt="user"></Image>
                    </div>
                    <div className={Stule.liveNow}>
                        <h6 className={Stule.liveNowH6}>LIVE NOW</h6>
                        <div className={Stule.AllItem}>
                            <div className={Stule.row}>
                                <div className={Stule.liveitem}>
                                    <Image src="/User.png" width={60} height={60}
                                        alt="user" className={Stule.imag}></Image>
                                    <div className={Stule.PlayIcon}>
                                        <PlayIcon/>
                                    </div>
                                </div>
                                <div className={Stule.liveitem}>
                                    <Image src="/User.png" width={60} height={60}
                                        alt="user" className={Stule.imag}></Image>
                                    <div className={Stule.PlayIcon}>
                                        <PlayIcon/>
                                    </div>
                                </div>

                                <div className={Stule.liveitem}>
                                    <Image src="/User.png" width={60} height={60}
                                        alt="user" className={Stule.imag}></Image>
                                    <div className={Stule.PlayIcon}>
                                        <PlayIcon/>
                                    </div>
                                </div>

                            </div>
                            <div className={Stule.row}>
                                <div className={Stule.liveitem}>
                                    <Image src="/User.png" width={60} height={60}
                                        alt="user" className={Stule.imag}></Image>
                                    <div className={Stule.PlayIcon}>
                                        <PlayIcon/>
                                    </div>
                                </div>
                                <div className={Stule.liveitem}>
                                    <Image src="/User.png" width={60} height={60}
                                        alt="user" className={Stule.imag}></Image>
                                    <div className={Stule.PlayIcon}>
                                        <PlayIcon/>
                                    </div>
                                </div>
                                <div className={Stule.liveitem}>
                                    <Image src="/User.png" width={60} height={60}
                                        alt="user" className={Stule.imag}></Image>
                                    <div className={Stule.PlayIcon}>
                                        <PlayIcon/>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>


                    <div className={Stule.howtoplay}>
                        <h6 className={Stule.howtoplayH6}>HOW TO PLAY ?</h6>
                        <p className={Stule.howtoplayP}>
                            A small ball moves across the screen,
                            bouncing off the top and bottom ledges,
                            and the two players each control a pad,
                            sliding it vertically between the ends
                            of the screen using the controls. 
                            If the ball hits the pad, it bounces back 
                            to the other player. If it misses the pad, 
                            the other player scores a point. 
                            The ball bounces in different ways depending 
                            on how it hits then pad.
                        </p>
                    </div>
                </div>
            </div>
    )
}