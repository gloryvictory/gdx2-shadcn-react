import {useEffect, useState} from 'react'
import axios, {AxiosError} from 'axios'
import { ICount } from '@/types/models'

export function useCounts(url : string) {
  const [stat_count, setCount] = useState<ICount>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  
  async function fetchCounts() {
    try {
      setError('')
      setLoading(true)
      
      const count1 = window.localStorage.getItem(url); // Retrieve auth token from localStorage
      // const count1 = null
      if (count1) {
        setCount(JSON.parse(count1)) 
      }else{
        const response = await axios.get<ICount>(url)
        window.localStorage.setItem(url, JSON.stringify(response.data));
        setCount(response.data)
      }


          // const counts:string = response.data['count']
          setLoading(false)
        } catch (e: unknown) {
          const error = e as AxiosError
          setLoading(false)
          setError(error.message)
        } 
    }
  

  useEffect(() => {
    fetchCounts()
  }, [])

  return { stat_count, error, loading }
}
