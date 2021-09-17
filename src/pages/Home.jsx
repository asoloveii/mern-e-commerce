import React from 'react'
import Announcement from '../components/Announcement'
import Categories from '../components/Categories'
import Footer from '../components/Footer'
import NewsLetter from '../components/NewsLetter'
import Slider from '../components/Slider'
import Navbar from './../components/Navbar'
import Products from './../components/Products'

export default function Home() {
  return (
    <div>
      <Announcement />
      <Navbar />
      <Slider />
      <Categories />
      <Products />
      <NewsLetter />
      <Footer />
    </div>
  )
}
