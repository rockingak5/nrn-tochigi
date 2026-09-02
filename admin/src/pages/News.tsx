import ResourceEditor from '../components/ResourceEditor'

export default function News() {
  return (
    <ResourceEditor
      title="News"
      resourcePath="/api/news"
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'date', label: 'Date', type: 'text' },
        { key: 'summary', label: 'Summary', type: 'textarea' },
        { key: 'imageUrl', label: 'Image', type: 'image' },
      ]}
      itemLabel={(item) => `${item.title as string} — ${item.date as string}`}
    />
  )
}
