"use client"

import CountUp from 'react-countup'

const AnimatedCounter = ({ amount }: {amount: number }) => {
  return (
    <h2>
        <CountUp
            duration = {1.5}
            decimal='.'
            prefix='£'
            decimals = {2}
            end = {amount}
        />
    </h2>
  )
}

export default AnimatedCounter