'use server'
import type { ServerFunctionClient } from 'payload'
import { handleServerFunctions as _handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './importMap'

export const handleServerFunctions: ServerFunctionClient = async (args) => {
  return _handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}
