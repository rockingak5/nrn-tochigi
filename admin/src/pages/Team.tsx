import ResourceEditor from '../components/ResourceEditor'

export default function Team() {
  return (
    <ResourceEditor
      title="Our Team"
      resourcePath="/api/team"
      fields={[
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'role', label: 'Role', type: 'text' },
        { key: 'photoUrl', label: 'Photo', type: 'image' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
      itemLabel={(item) => `${item.name as string} — ${item.role as string}`}
    />
  )
}
