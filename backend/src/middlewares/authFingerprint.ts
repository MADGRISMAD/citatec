import fs from 'fs' 
import { Request, Response, NextFunction } from 'express'
import { FingerprintRegistry } from '../interfaces/fingerprintRegistry'
import { outputLog } from 'shared-types'
import ConfigManager from '../classes/ConfigManager'


const getFingerprintFile = () => {
    const data= fs.readFileSync(ConfigManager.get("ADMIN_DEVICES_PATH"), 'utf8')
    return JSON.parse(data) as FingerprintRegistry[]
}

export const checkFingerprint = (req:Request, res: Response, next: NextFunction) => {
  const fingerprint = req.headers['device-id'] as string
  const fingerprintFile = getFingerprintFile()
    //   filter the fingerprint file to find the fingerprint
  if (fingerprintFile.filter((f) => f.fingerprint == fingerprint).length > 0) {
    // if the fingerprint is found, add to local request object
    res.locals.fingerprintFound = true    
    next()
} 
  next()
}

export const verifyFingerprint = (req:Request, res: Response, next: NextFunction) => {
    if (!res.locals.fingerprintFound) {
        outputLog('Fingerprint not found')
        return res.status(401).send('Unauthorized')
    }
    next()
}