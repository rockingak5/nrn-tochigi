type FormFieldProps = {
  id: string
  label: string
  type?: 'text' | 'email'
  as?: 'input' | 'textarea'
  required?: boolean
  maxLength?: number
  autoComplete?: string
}

export default function FormField({
  id,
  label,
  type = 'text',
  as = 'input',
  required = false,
  maxLength,
  autoComplete,
}: FormFieldProps) {
  const fieldClassName =
    'w-full rounded-lg border border-slate-300 px-4 py-2 focus:border-brand-navy focus:outline-none'

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-brand-navy">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          rows={5}
          required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={fieldClassName}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          maxLength={maxLength}
          autoComplete={autoComplete}
          className={fieldClassName}
        />
      )}
    </div>
  )
}
