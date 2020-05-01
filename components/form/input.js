import { ErrorMessage, useFormContext } from 'react-hook-form'

import FormError from './error'
import FormLabel from './label'

function FormInput({
  disabled = false,
  field,
  label,
  type = 'text',
  ...props
}) {
  const { errors, register } = useFormContext()

  return (
    <div>
      <div className="flex flex-col">
        {label && <FormLabel label={label} for={field} />}
        <input
          name={field}
          id={field}
          type={type}
          disabled={disabled}
          ref={register}
          {...props}
        />
      </div>
      <ErrorMessage as={<FormError />} name={field} errors={errors} />
    </div>
  )
}

export default FormInput
