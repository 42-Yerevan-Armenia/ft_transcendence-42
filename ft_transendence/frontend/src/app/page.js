"use client"
import './page.module.css';
import SectionHome from '@/components/layout/SectionHome.js'
import  store  from '@/redux/store';
import { Provider } from "react-redux";

export default function Home() {
  return (
    <Provider store={store}>
      <SectionHome/>
    </Provider>
  )
}
