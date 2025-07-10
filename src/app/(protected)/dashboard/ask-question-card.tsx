'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import useProject from '@/hooks/use-project'
import Image from 'next/image';
import React, { useState } from 'react'

const AskQuestionCard = () => {
    const {project} = useProject();
    const [open,setOpen] = React.useState(false)
    const [question,setQuestion] = React.useState('')
    
    const onSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault()
        setOpen(true)
    }

  return (
    <>
    <Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className="flex items-center space-x-2">
        <Image src='/logo.png' alt='decode' width={40} height={40} />
        <span>Ask Decode</span>
      </DialogTitle>
    </DialogHeader>
  </DialogContent>
</Dialog>


        <Card className='relative col-span-3'>
            <CardHeader>
                <CardTitle>Ask a question</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit}>
                    <Textarea placeholder='Which file should i edit to change the home page?' value={question} onChange={e => setQuestion(e.target.value)} />
                        <div className='h-4'></div>
                        <Button type='submit'>Ask Decode!</Button>
                </form>
            </CardContent>
        </Card>
    </>
  )
}

export default AskQuestionCard