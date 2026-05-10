import React from 'react'
import { Header, Footer } from './index'
import { Outlet } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"

function Layout() {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
            <Analytics />
        </>
    )
}

export default Layout