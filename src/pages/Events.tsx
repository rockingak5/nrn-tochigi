import PageHeading from '../components/PageHeading'
import placeholderImage from '../assets/placeholder-image.svg'

const placeholderEvents = [
  { title: 'Event Title 1', date: 'Date TBD', description: 'Add a short description of this event here.' },
  { title: 'Event Title 2', date: 'Date TBD', description: 'Add a short description of this event here.' },
  { title: 'Event Title 3', date: 'Date TBD', description: 'Add a short description of this event here.' },
]

export default function Events() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeading>Events</PageHeading>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {placeholderEvents.map((event) => (
          <div key={event.title} className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <img src={placeholderImage} alt="" className="h-40 w-full object-cover" />
            <div className="p-6">
              <p className="mb-1 text-sm font-semibold text-slate-500">{event.date}</p>
              <h2 className="mb-2 text-xl font-bold text-brand-navy">{event.title}</h2>
              <p className="text-slate-600">{event.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
