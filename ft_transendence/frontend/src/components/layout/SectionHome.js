"use client"
import * as React from "react";
import LeftSection from '@/components/layout/LeftSection/LeftSection';
import Style from './SectionHome.module.css';
import Midle from '@/components/layout/midle/Midle';
import Right from '@/components/layout/right/Right';
import MidleSettings from '@/components/layout/settings/MidleSettings';
import MidleCub from '@/components/layout/cub/MidleCub';
import { useSelector } from 'react-redux';
import {ShowMidlle} from '@/redux/features/dataSlice';

//for change midle
// import {  useSelector } from 'react-redux';
// import {ShowMidlle} from '@/redux/features/dataSlice';
// const {Settings} = useSelector(ShowMidlle);
// display={`${Settings? "true" : "false"}`


export default function SectionHome(props) {
  
  const {homeConteiner, } = useSelector(ShowMidlle);
  console.log("homeConteiner == [" + homeConteiner + "]");

  return (
      <section className={Style.homeSection}>
        <div className={Style.stylemain}>
          <div className={Style.left}>
            <LeftSection />
          </div>
          <div className={Style.midle} style={{ display: homeConteiner ? "block" : "none" }}>
            <Midle />
          </div>
          
          <MidleSettings/>

          <MidleCub />

          <div className={Style.right}>
            <Right/>
          </div>
        </div>
      </section>
  );
}

