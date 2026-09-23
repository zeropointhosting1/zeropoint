import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { ProjectArt } from "./project-art"
import { StatusBadge } from "./status-badge"
import { TechBadge } from "./tech-badge"
import type { Project } from "@/lib/projects"
import { localPhoto } from "@/lib/local-photo"

export function ProjectCard({ project, icon }: { project: Project; icon: LucideIcon }) {
  const photoSrc = localPhoto(`lab/projects/${project.id}.jpg`) ?? undefined
  const body = (
    <>
      <ProjectArt icon={icon} label={project.status} photoSrc={photoSrc} className="aspect-video w-full" />
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-semibold tracking-tight text-foreground">{project.title}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">{project.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <TechBadge key={t}>{t}</TechBadge>
          ))}
        </div>
      </div>
    </>
  )

  const className =
    "block h-full overflow-hidden rounded-2xl border border-border bg-surface-raised transition-[transform,box-shadow,border-color] duration-300"

  if (project.href) {
    return (
      <Link
        href={project.href}
        className={`${className} hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_16px_40px_-16px_var(--accent-glow)]`}
      >
        {body}
      </Link>
    )
  }

  return <div className={className}>{body}</div>
}
