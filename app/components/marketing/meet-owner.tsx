import Image from "next/image"
import Link from "next/link"
import { UserRound } from "lucide-react"
import { OWNER } from "@/lib/site-config"
import { withBasePath } from "@/lib/base-path"
import { localPhoto } from "@/lib/local-photo"
import { Eyebrow } from "./eyebrow"

export function MeetOwner() {
  const photo = localPhoto("about/headshot.jpg")
  return (
    <section className="border-b border-border bg-surface-raised">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-24 sm:grid-cols-[180px_1fr]">
        {photo ? <Image src={withBasePath(photo)} alt={OWNER.name} width={180} height={180} unoptimized className="aspect-square rounded-2xl object-cover" /> : (
          <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-surface p-4 text-center">
            <UserRound aria-hidden="true" className="size-10 text-primary" /><p className="break-words text-xs text-text-secondary">{OWNER.photoPlaceholder}</p>
          </div>
        )}
        <div><Eyebrow>Local, personal support</Eyebrow><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Meet the person behind ZeroPoint</h2><p className="mt-4 font-semibold">{OWNER.name}</p><p className="mt-2 max-w-2xl text-text-secondary">{OWNER.bio}</p><Link href="/about/" className="mt-5 inline-block text-sm font-medium text-primary hover:underline">More about ZeroPoint →</Link></div>
      </div>
    </section>
  )
}
