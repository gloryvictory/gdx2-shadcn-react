import { useState} from 'react'
import React from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { useMessage } from '@/hooks/useMessage';
import { gdx2_urls } from '@/config/urls';
// import { Tooltip } from '../ui/tooltip';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'

// import { Button, Spin, Tooltip  } from 'antd';
// import { getMessages } from '../actions/getAll';


const Message: React.FC = () => {
  // const [data, setData] = useState<IResult>(null)
  // const [isLoading, setLoading] = useState<boolean>(false)
  // const [isOk, setOk] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  const { data, loading, error,} = useMessage(gdx2_urls.gdx2_url_message)


  // useEffect(() => {
  //     const { data, loading, error,} = useMessage(gdx2_urls.gdx2_url_message)
  //     setData(data)
  //     setLoading(loading)

  // }, [])
  
  // useEffect(() => {
  //   if(isModalOpen) {
  //     router.reload(); 
  //   }
  // }, [isModalOpen])

  return (
    <>
      { loading && <Spinner size="md" className="bg-black dark:bg-white" /> }
      { error && `Error: ${error}` }
    
    <div className="">
      
      <div className="container py-1 px-1 mx-0 min-w-full">
        <div className="flex justify-center">
          
          <Button 
            className="min-w-full lg:inline-block hover:ring-blue-200/50 dark:hover:text-slate-800 bg-slate-500 ring-blue-500/50 dark:text-slate-200"
            onClick={()=>{setIsModalOpen(true); console.log(`isModalOpen: ${isModalOpen}`) } }
            disabled={isModalOpen}
          >
            {!isModalOpen ? "Добавить свое Пожелание" : "Ваше пожелание принято!"} 
          </Button>
        </div>
      </div>
      
      {/* {isModalOpen ? <MessageForm open={isModalOpen} onOk={handleOk} onCancel={handleCancel}   /> : null} */}
      <TooltipProvider>

      <div className="mt-2">
        <h1>Пожеланий: <strong>{data?.count}</strong> </h1>

        {/* <ol type="1" className="marker:text-sky-400 list-disc pl-5 space-y-3 text-slate-500"> */}
        <ol className="marker:text-sky-400 pl-5 space-y-3 text-slate-500 list-decimal ml-10 ">
          {data && data?.data.map((item: any ) => (                
            <li key={item.id} className={ "w-full box-border rounded bg-slate-100 w-96 pl-2 hover:bg-slate-700 hover:text-sky-400"} > 
            <Tooltip>
              <TooltipTrigger>
                
                  <span className="font-mono">{item.name_ru}</span>
                
              </TooltipTrigger>
              <TooltipContent>
                <p>{ 'Дата: ' + new Date(item.lastupdate).toLocaleDateString('ru-RU') }</p>
                <p>{ "ФИО: " + ` ${item.fio}` }</p>
                <p>{ "Почта: " + ` ${item.email}`}</p>

              </TooltipContent>
            </Tooltip>
            </li>
          ))}
        </ol>

      </div>
      </TooltipProvider>

    </div>
    


    </>
  );
}

export default Message;
// type="primary"


// { 'Дата: ' + new Date(item.lastupdate).toLocaleDateString('ru-RU') + "ФИО: " + ` ${item.fio}` + "\n Почта: " + ` ${item.email}`}
