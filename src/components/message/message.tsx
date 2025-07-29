import { useState} from 'react'
import React from 'react';
import { Button } from '../ui/button';
import { Spinner } from '../ui/spinner';
import { useMessage } from '@/hooks/useMessage';
import { gdx2_urls } from '@/config/urls';
// import { Tooltip } from '../ui/tooltip';
import { CirclePlus } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import MessageForm from './MessageForm';

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
  
  const { data, loading, error } = useMessage(gdx2_urls.gdx2_url_message)


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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {loading && <Spinner size="md" className="bg-black dark:bg-white" />}
      {error && <div className="text-red-500 text-center mb-4">Error: {error}</div>}
      {isModalOpen && <MessageForm open={isModalOpen} onOk={handleOk} onCancel={handleCancel} />}
      
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            Пожелания <span className="text-blue-500">({data?.count})</span>
          </h1>
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white transition-colors duration-200 flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
            onClick={() => setIsModalOpen(true)}
            disabled={isModalOpen}
          >
            <CirclePlus className="h-5 w-5" />
            {!isModalOpen ? "Добавить пожелание" : "Ваше пожелание принято!"}
          </Button>
      </div>
      
        {/* Messages List */}
      <TooltipProvider>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <ol className="space-y-4">
              {data && data?.data.map((item: any) => (
                <li 
                  key={item.id} 
                  className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold">
                      {item.id}
                    </div>
                    <div className="flex-grow">
            <Tooltip>
              <TooltipTrigger>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                            {item.name_ru}
                          </h3>
              </TooltipTrigger>
                        <TooltipContent className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                          <div className="space-y-2">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-medium">Дата:</span> {new Date(item.lastupdate).toLocaleDateString('ru-RU')}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-medium">ФИО:</span> {item.fio}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              <span className="font-medium">Почта:</span> {item.email}
                            </p>
                          </div>
              </TooltipContent>
            </Tooltip>
                    </div>
                  </div>
            </li>
          ))}
        </ol>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default Message;
// type="primary"


// { 'Дата: ' + new Date(item.lastupdate).toLocaleDateString('ru-RU') + "ФИО: " + ` ${item.fio}` + "\n Почта: " + ` ${item.email}`}
