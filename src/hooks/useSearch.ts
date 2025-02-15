
// export async function getReportsByQuery(query: string| undefined): Promise<IResultReport> {
//   const url = `${api_gdx2}/query?q=${query}`
//   const response = await fetch( url );
//   if (!response.ok) throw new Error(`Unable to fetch ${url}!`);
//   return response.json();
// }

import {useEffect, useState} from 'react'
import axios, {AxiosError} from 'axios'
import { IResultReport } from '@/types/models'
import { gdx2_urls } from '@/config/urls'

export function useSearch(query: string| undefined) {
  const [data, setData] = useState<IResultReport>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  
  async function getReportsByQuery() {
    try {
      const url = `${gdx2_urls.gdx2_url_report_search}${query}`

      setError('')
      setLoading(true)
      const response = await axios.get<IResultReport>(url)
      setData(response?.data)
      // const count1 = window.localStorage.getItem(url); // Retrieve auth token from localStorage
      // if (count1) {
      //   setCount(JSON.parse(count1)) 
      // }else{
      //   const response = await axios.get<ICount>(url)
      //   window.localStorage.setItem(url, JSON.stringify(response.data));
      //   setCount(response.data)
      // }

      setLoading(false)
    } catch (e: unknown) {
        const error = e as AxiosError
        setLoading(false)
        setError(error?.message)
    }
  }

  useEffect(() => {
    getReportsByQuery()
  }, [])

  return { data, error, loading }
}
