import * as React from "react"
import { nanoid } from 'nanoid'

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useMethod } from "@/hooks/useMethod"
import { gdx2_urls } from "@/config/urls"
import { Spinner } from "@/components/ui/spinner"

// const tags = Array.from({ length: 150 }).map(
//   (_, i, a) => `v1.2.0-beta.${a.length - i}`
// )

export function AreaFilter() {
  const {data, error, loading} = useMethod(gdx2_urls.gdx2_url_sta_method)
  console.log(data)




  return (
    <>
    { loading && <Spinner size="md" className="bg-black dark:bg-white" /> }
    { error && `Error: ${error}` }

    <ScrollArea className="w-full h-screen rounded-md border">
      <div  key={nanoid()} className="p-4">
        <h4  key={nanoid()} className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {data?.data  && data?.data?.map((res) => (
          <>
            <div key={nanoid()} className="text-sm">
              {res}
            </div>
            <Separator key={nanoid()} className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
    
    </>
  )
}
