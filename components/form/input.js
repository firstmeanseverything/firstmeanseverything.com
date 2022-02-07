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
  const {
    formState: { errors },
    register
  } = useFormContext()

  const hasError = errors[field]

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {label && (
          <div>
            <FormLabel label={label} htmlFor={field} />
          </div>
        )}
        <div className="mt-1 rounded-md shadow-sm">
          <input
            className={cx(
              'focus:shadow-outline-blue block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 transition duration-150 ease-in-out focus:border-blue-300 focus:outline-none sm:text-sm sm:leading-5',
              {
                'border-red-600': hasError,
                'cursor-not-allowed opacity-50': disabled
              }
            )}
            id={field}
            type={type}
            disabled={disabled}
            {...register(field)}
            {...props}
          />
        </div>
      </div>
      {hasError && <FormError>{errors?.[field]?.message}</FormError>}
    </div>
  )
}

export default FormInput
