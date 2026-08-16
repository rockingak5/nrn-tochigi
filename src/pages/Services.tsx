import PageHeading from '../components/PageHeading'
import placeholderImage from '../assets/placeholder-image.svg'

const placeholderServices = [
  { name: 'Service Name 1', description: 'Add a short description of this service here.' },
  { name: 'Service Name 2', description: 'Add a short description of this service here.' },
  { name: 'Service Name 3', description: 'Add a short description of this service here.' },
  { name: 'Service Name 4', description: 'Add a short description of this service here.' },
]

export default function Services() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <PageHeading>Services</PageHeading>
      <div className="grid gap-6 sm:grid-cols-2">
        {placeholderServices.map((service) => (
          <div
            key={service.name}
            className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 shadow-sm"
          >
            <img src={placeholderImage} alt="" className="h-20 w-20 shrink-0 rounded-lg object-cover" />
            <div>
              <h2 className="font-bold text-brand-navy">{service.name}</h2>
              <p className="text-slate-600">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
