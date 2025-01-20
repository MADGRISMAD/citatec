import fs from 'fs' 
import { Request, Response, NextFunction } from 'express'
import { FingerprintRegistry } from '../interfaces/fingerprintRegistry'
import { outputLog } from 'shared-types'
import ConfigManager from '../classes/ConfigManager'
import { ADMIN_DEVICES_PATH } from '../constants/paths'


export const getFingerprintFile = () => {
  if(!fs.existsSync(ADMIN_DEVICES_PATH)){
    fs.writeFileSync(ADMIN_DEVICES_PATH, JSON.stringify([
      {
        "sid": "identificadorPrueba",
        "fingerprint" : "7660b98e396e2818239b740d50f42cfc"
    }
    ]))
    return []
  }
    const data= fs.readFileSync(ADMIN_DEVICES_PATH, 'utf8')
    return JSON.parse(data) as FingerprintRegistry[]
}

export const checkFingerprint = (req:Request, res: Response, next: NextFunction) => {

  const fingerprint = req.headers['device-id'] as string
  const fingerprintFile = getFingerprintFile()
    //   filter the fingerprint file to find the fingerprint
  if (fingerprintFile.filter((f) => f.fingerprint == fingerprint).length > 0) {
    // if the fingerprint is found, add to local request object
    res.locals.fingerprintFound = true  
    outputLog('Fingerprint found ' + fingerprint)  
} 
else
  outputLog('Fingerprint not found ' + fingerprint)
  next()
}

export const verifyFingerprint = (req:Request, res: Response, next: NextFunction) => {
    if (!res.locals.fingerprintFound) {
        return res.status(401).send('Unauthorized')
    }
    next()
}