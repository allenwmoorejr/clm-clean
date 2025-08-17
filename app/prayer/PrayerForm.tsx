'use client'
import { useState } from 'react'

export default function PrayerForm(){
  const [name,setName] = useState('')
  const [request,setRequest] = useState('')
  const [status,setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    setStatus('loading')
    try{
      const res = await fetch('/api/prayer',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,request})})
      if(res.ok){
        setStatus('success')
        setName('')
        setRequest('')
      }else{
        setStatus('error')
      }
    }catch{
      setStatus('error')
    }
  }

  return(
    <div className="container py-24">
      <h1 className="text-center gradient-title mb-4">Prayer Request</h1>
      <p className="text-center text-white/70 mb-10 max-w-2xl mx-auto">We would be honored to pray with you. Share your request below and our pastor will receive it instantly.</p>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto card p-8 flex flex-col gap-4">
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          required
          placeholder="Your name"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500"
        />
        <textarea
          value={request}
          onChange={e=>setRequest(e.target.value)}
          required
          placeholder="How can we pray for you?"
          rows={5}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 resize-none"
        />
        <button type="submit" disabled={status==='loading'} className="btn-primary tap-target">
          {status==='loading' ? 'Sending…' : 'Send Request'}
        </button>
        {status==='success' && <p className="text-green-400 text-sm">Thanks! Your request has been sent.</p>}
        {status==='error' && <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>}
      </form>
    </div>
  )
}
