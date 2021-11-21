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
              'appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5',
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
