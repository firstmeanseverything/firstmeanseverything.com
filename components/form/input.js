import cx from 'classnames'
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

  const hasError = errors[field]

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {label && <FormLabel label={label} for={field} />}
        <input
          className={cx(
            'appearance-none border focus:border-blue-500 focus:outline-none px-4 py-2 rounded w-full',
            {
              'border-red-600': hasError,
              'cursor-not-allowed opacity-50': disabled,
            }
          )}
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
