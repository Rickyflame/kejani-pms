import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (

    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className='flex min-h-screen flex-col items-center justify-center gap-4 p-8'>
        <h1 className='text-3xl font-bold text-slate-800'>KEJANI PMS</h1>
        <p className='text-slate-500'>Week 1 · Day 1 — Bootstrap verified</p>
        <Button>Shadcn Button Works</Button>
      </main>
    </div>
  );
}
