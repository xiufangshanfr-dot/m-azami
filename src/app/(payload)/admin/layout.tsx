import { RootLayout } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './importMap'
import { handleServerFunctions } from './actions'
import React from 'react'
import '@payloadcms/ui/scss/app.scss'
import './custom.css'

type Args = {
  children: React.ReactNode
}

const Layout = ({ children }: Args) =>
  RootLayout({ children, config, importMap, serverFunction: handleServerFunctions })

export default Layout
