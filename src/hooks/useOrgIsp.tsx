import {useEffect, useState} from 'react'
import axios, {AxiosError} from 'axios'
import {  IResultStringArray } from '@/types/models'



export function useOrgIsp(url : string ) {
  const [dataOrgIsp, setData] = useState<IResultStringArray>()
  const [loadingOrgIsp, setLoading] = useState(false)
  const [errorOrgIsp, setError] = useState('')

  
  async function fetchData() {

    try {
      setError('')
      setLoading(true)
      
      const data1 = window.localStorage.getItem(url); // Retrieve auth token from localStorage
      // const data1 = null

      if (data1) {
        setData(JSON.parse(data1)) 
      }else{
        const response = await axios.get<IResultStringArray>(url)
        window.localStorage.setItem(url, JSON.stringify(response?.data));
        setData(response?.data )
      }

      setLoading(false)
    } catch (e: unknown) {
      const error = e as AxiosError
      setLoading(false)
      setError(error?.message)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return { dataOrgIsp, errorOrgIsp, loadingOrgIsp }
}
