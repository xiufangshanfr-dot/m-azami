'use server'
import { handleServerFunctions as _handleServerFunctions } from '@payloadcms/next/layouts'
import config from '@payload-config'
import { importMap } from './importMap'

export const handleServerFunctions = async (...args: Parameters<typeof _handleServerFunctions>) => {
  return _handleServerFunctions({
    ...args[0],
    config,
    importMap,
  })
}
