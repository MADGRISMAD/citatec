import axios, { AxiosResponse } from "axios"
import customAxios from "@/utils/axios"
import { getFingerprint } from "@/utils/fingerprint"

export async function uploadPDF(file: File): Promise<AxiosResponse | undefined> {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('device-id', await getFingerprint())
      try {
        const response: AxiosResponse = await customAxios.post('/materias', formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',

          }
      })

        return response
      } catch (error) {
        console.error('Error al subir el PDF:', error)
      }
    }
  }

  export const loadPDF = async () : Promise<string | undefined> => {
    try {
      const response = await customAxios.get('/materias', {
        responseType: 'arraybuffer'
      })
      const blob = new Blob([response.data], { type: 'application/pdf' })
      return URL.createObjectURL(blob)
    } catch (error) {
      console.error('Error al cargar el PDF:', error)
    }
  }