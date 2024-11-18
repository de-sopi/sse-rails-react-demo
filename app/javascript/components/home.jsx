import React from 'react'
import '../styles/home.css'

const Home = () => {
  return (
  <div className={'homediv'}>
    <h1>How to make Server Sent Events work in Ruby on Rails</h1>
    <h2>Today we'll be answering the following questions</h2>
    <div className={'question-div'}>
      <h3>What happens if we just follow a basic tutorial? </h3>
      <h3>Why isn't this enough?</h3>
      <h3>How can we send data from anywhere within the application through the SSE</h3>
      <h3>What happens in the background between Puma and Rails; why do we care?</h3>
      <h3>What is Rack Hijacking and how to apply it in this case</h3>
    </div>
  </div>
  )
}

export default Home