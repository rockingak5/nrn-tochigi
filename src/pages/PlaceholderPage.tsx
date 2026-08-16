import PageHeading from '../components/PageHeading'
import placeholderImage from '../assets/placeholder-image.svg'

type PlaceholderPageProps = {
  title: string
}

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <section className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-16 sm:flex-row sm:items-center sm:px-6">
      <img
        src={placeholderImage}
        alt=""
        className="w-full shrink-0 rounded-xl object-cover sm:w-64"
      />
      <div>
        <PageHeading className="mb-4">{title}</PageHeading>
        <p className="text-lg text-slate-600">
          Content for this page is coming soon. Replace this placeholder with real NRNA Tochigi
          information about {title.toLowerCase()}.
        </p>
      </div>
    </section>
  )
}
