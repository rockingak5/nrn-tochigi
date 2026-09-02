import ResourceEditor from '../components/ResourceEditor'

export default function Services() {
  return (
    <ResourceEditor
      title="Services"
      resourcePath="/api/services"
      fields={[
        { key: 'name', label: 'Name', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
        { key: 'imageUrl', label: 'Image', type: 'image' },
        { key: 'order', label: 'Order', type: 'number' },
      ]}
      itemLabel={(item) => item.name as string}
    />
  )
}
