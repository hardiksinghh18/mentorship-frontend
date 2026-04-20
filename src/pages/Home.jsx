import React from 'react'
import { useSelector } from 'react-redux'
import HeroSection from '../components/sections/Hero'
import Dashboard from './Dashboard'
import GlobalLoader from '../components/loaders/GlobalLoader'

const Home = () => {
  const { isLoggedIn, isChecking } = useSelector((state) => state.auth);

  if (isChecking) {
    return <GlobalLoader />;
  }
 
  return (
    <>
      {isLoggedIn ? <Dashboard /> : <HeroSection />}
    </>
  )
}

export default Home
