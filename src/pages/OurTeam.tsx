import { useEffect, useState } from 'react'
import PageHeading from '../components/PageHeading'
import placeholderImage from '../assets/placeholder-image.svg'
import { apiGet, resolveAssetUrl } from '../lib/api'

type TeamMember = {
  id: number
  name: string
  role: string
  photoUrl: string | null
}

export default function OurTeam() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet<TeamMember[]>('/api/team')
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeading>Our Team</PageHeading>
      {loading ? (
        <p className="text-slate-500">Loading…</p>
      ) : members.length === 0 ? (
        <p className="text-slate-500">No team members yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member) => (
            <div key={member.id} className="text-center">
              <img
                src={resolveAssetUrl(member.photoUrl) ?? placeholderImage}
                alt=""
                className="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
              />
              <h2 className="font-bold text-brand-navy">{member.name}</h2>
              <p className="text-slate-600">{member.role}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
