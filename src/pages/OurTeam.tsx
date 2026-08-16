import PageHeading from '../components/PageHeading'
import placeholderImage from '../assets/placeholder-image.svg'

const placeholderMembers = [
  { name: 'Member Name', role: 'President' },
  { name: 'Member Name', role: 'Vice President' },
  { name: 'Member Name', role: 'Secretary' },
  { name: 'Member Name', role: 'Treasurer' },
]

export default function OurTeam() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeading>Our Team</PageHeading>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {placeholderMembers.map((member, i) => (
          <div key={i} className="text-center">
            <img
              src={placeholderImage}
              alt=""
              className="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
            />
            <h2 className="font-bold text-brand-navy">{member.name}</h2>
            <p className="text-slate-600">{member.role}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
