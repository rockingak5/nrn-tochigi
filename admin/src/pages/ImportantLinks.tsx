import ResourceEditor from '../components/ResourceEditor'

export default function ImportantLinks() {
  return (
    <ResourceEditor
      title="Important links"
      resourcePath="/api/important-links"
      fields={[
        { key: 'label', label: 'Label (e.g. NRNA International, Nepal Government)', type: 'text' },
        { key: 'url', label: 'URL', type: 'text' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
      itemLabel={(item) => `${item.label as string} — ${item.url as string}`}
    />
  )
}
