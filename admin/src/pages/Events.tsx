import ResourceEditor from '../components/ResourceEditor'

export default function Events() {
  return (
    <ResourceEditor
      title="Events"
      resourcePath="/api/events"
      fields={[
        { key: 'title', label: 'Title', type: 'text' },
        { key: 'date', label: 'Date', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'imageUrl', label: 'Image', type: 'image' },
      ]}
      itemLabel={(item) => `${item.title as string} — ${item.date as string}`}
    />
  )
}
