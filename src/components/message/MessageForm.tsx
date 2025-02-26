
import { useState, useEffect} from 'react'
import React from 'react';

type FieldType = {
  fio?: string;
  email?: string;
  message?: string;
};

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

const MessageForm: React.FC<IMessageProps> = ({ open, onOk, onCancel }: IMessageProps) => {


return (
    <>
   

    </>
  );
}

export default MessageForm;


