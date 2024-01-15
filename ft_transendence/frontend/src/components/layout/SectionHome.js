"use client"
import * as React from "react";
import LeftSection from '@/components/layout/LeftSection/LeftSection';
import Style from './SectionHome.module.css';
import Midle from '@/components/layout/midle/Midle';

export default function SectionHome(props) {
  return (
      <section className={Style.homeSection}>
        <div className={Style.stylemain}>
          <div className={Style.left}>
            <LeftSection />
          </div>
          <div className={Style.midle}>

            
            <Midle />
          </div>
          <div className={Style.right}>
            right
          </div>
        </div>
      </section>
  );
}

