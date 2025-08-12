import { NextResponse } from 'next/server';function esc(s:string){return s.replace(/,/g,'\\,').replace(/;/g,'\\;').replace(/\n/g,'\\n')}export async function GET(req:Request){const {searchParams}=new URL(req.url);const title=searchParams.get('title')||'CLM Service';const desc=searchParams.get('desc')||'';const start=searchParams.get('start');const end=searchParams.get('end')||start||'';const loc=searchParams.get('loc')||'Christ Like Ministries, Birmingham, AL';if(!start)return new NextResponse('Missing start',{status:400});const dt=(x:string)=>x.replace(/[-:]/g,'').replace('.000','').replace('Z','Z');const ics=`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CLM//Schedule//EN
BEGIN:VEVENT
UID:${Date.now()}@clm
DTSTAMP:${dt(new Date().toISOString())}
DTSTART:${dt(start)}
DTEND:${dt(end)}
SUMMARY:${esc(title)}
DESCRIPTION:${esc(desc)}
LOCATION:${esc(loc)}
END:VEVENT
END:VCALENDAR`.replace(/\n/g,'\r\n');return new NextResponse(ics,{headers:{'Content-Type':'text/calendar; charset=utf-8','Content-Disposition':'attachment; filename=event.ics'}})}