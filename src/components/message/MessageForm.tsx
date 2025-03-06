
// import { useState, useEffect} from 'react'
import React from 'react';
// import { Modal  } from 'shadcn';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Textarea } from '../ui/textarea';
import { gdx2_urls } from '@/config/urls';
// import Message from './message';

// type FieldType = {
//   fio?: string;
//   email?: string;
//   name_ru?: string;
// };

export type IMessageProps = {
  open?:boolean 
  onOk: ()=>void;
  onCancel: ()=>void;
} 

export type IMessage = {
  fio: string;
  email: string;
  name_ru: string;
}

const formSchema = z.object({
  fio: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z. string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  message: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
})


const MessageForm: React.FC<IMessageProps> = ({ open, onOk, onCancel }: IMessageProps) => {

  // const [data, setData] = useState<IMessage>()

  // POST request using fetch inside useEffect React hook
  const postData = async (fio:string, email:string, message:string) => {
    const data:IMessage = {
      "fio": fio,
      "email": email,
      "name_ru": message
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };
    if (data){
    const response = await fetch(gdx2_urls.gdx2_url_message, requestOptions);
      if (response.ok)  {
        // messageApi.info('Сообщение отправлено!');
        open=false;
        // router.reload();
      }    
    }
  }


  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fio: "",
      email: "",
      message: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    const msg:IMessage = {
      "fio": values.fio,
      "email": values.email,
      "name_ru": values.message
    }
    // setData(msg)
    postData(values.fio, values.email, values.message)
    onOk()
    window.localStorage.clear(); 
    window.location.reload();
    console.log(values)
  }

return (
    <>

    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <>
          <FormField
            control={form.control}
            name="fio"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>ФИО</FormLabel>
                  <FormControl>
                    <Input placeholder="Пример: Иванов Иван Иванович" {...field} />
                  </FormControl>
                  <FormDescription>
                    Тут пишем Фамилию Имя Отчество для обратной связи.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
            )}  
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>EMAIL</FormLabel>
                  <FormControl>
                    <Input placeholder="Пример: Ivanov@zsniigg.ru" {...field} />
                  </FormControl>
                  <FormDescription>
                    Тут пишем EMAIL для обратной связи.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
            )}  
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
                <FormItem>
                  <FormLabel>Пожелание</FormLabel>
                  <FormControl>
                    {/* <Input placeholder="Пример: Ivanov@zsniigg.ru" {...field} /> */}
                    <Textarea placeholder="Ваше сообщение..."  {...field}/>
                  </FormControl>
                  <FormDescription>
                    Тут пишем Ваше пожелание для обратной связи.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
            )}  
          />
          <div className='flex justify-start '>
            <Button className='ml-1 mr-2 dark:focus:bg-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200 hover:bg-slate-500 focus:bg-slate-700' type="submit">Отправить</Button>
            <Button className='bg-slate-600 dark:focus:bg-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200 hover:bg-slate-700 focus:bg-slate-700' onClick={onCancel}>Отмена</Button>
          </div>
          
          </>
        </form>
      </Form>

    </>
  );
}

export default MessageForm;


