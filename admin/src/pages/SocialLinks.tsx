import ResourceEditor from '../components/ResourceEditor'

export default function SocialLinks() {
  return (
    <ResourceEditor
      title="Social links"
      resourcePath="/api/social-links"
      fields={[
        { key: 'platform', label: 'Platform (e.g. Facebook, Instagram, YouTube)', type: 'text' },
        { key: 'url', label: 'URL', type: 'text' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
      itemLabel={(item) => `${item.platform as string} — ${item.url as string}`}
    />
  )
}
