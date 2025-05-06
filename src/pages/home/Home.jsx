import React from 'react'
import Layout from '../../hoc/Layout'
import EmptyChat from '../../components/EmptyChat'

const Home = () => {

  return (
    <>
      <Layout>
        <div className="flex h-full items-center justify-center">
          <EmptyChat/>
        </div>
      </Layout>
    </>
  )
}

export default Home