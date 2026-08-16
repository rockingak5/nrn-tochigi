import activityImage from '../assets/activity.svg'

const activities = [
  'Tihar Festival celebrated in Japan.',
  'Children exchanging marigold garlands.',
  'Nepali culture and traditions preserved.',
  'Community gathering and joyous moments.',
]

export default function Activities() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
      <div>
        <h2 className="mb-6 text-3xl font-extrabold text-brand-navy sm:text-4xl">
          Recent Activities
        </h2>
        <ul className="space-y-4">
          {activities.map((item) => (
            <li key={item} className="text-lg text-brand-navy sm:text-xl">
              - {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mx-auto w-full max-w-md">
        <img
          src={activityImage}
          alt="Children exchanging marigold garlands during Tihar"
          className="w-full rounded-lg object-cover shadow-lg"
        />
      </div>
    </section>
  )
}
