import PageHeading from '../components/PageHeading'
import placeholderImage from '../assets/placeholder-image.svg'

const placeholderNews = [
  { title: 'News Headline 1', date: 'Date TBD', summary: 'Add a short summary of this news item here.' },
  { title: 'News Headline 2', date: 'Date TBD', summary: 'Add a short summary of this news item here.' },
  { title: 'News Headline 3', date: 'Date TBD', summary: 'Add a short summary of this news item here.' },
]

export default function News() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <PageHeading>News</PageHeading>
      <div className="space-y-8">
        {placeholderNews.map((item) => (
          <article
            key={item.title}
            className="flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row"
          >
            <img
              src={placeholderImage}
              alt=""
              className="h-40 w-full shrink-0 rounded-lg object-cover sm:h-32 sm:w-48"
            />
            <div>
              <p className="mb-1 text-sm font-semibold text-slate-500">{item.date}</p>
              <h2 className="mb-2 text-xl font-bold text-brand-navy">{item.title}</h2>
              <p className="text-slate-600">{item.summary}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
