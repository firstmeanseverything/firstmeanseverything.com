function FormLabel({ label, ...props }) {
  return (
    <label
      className="block text-sm font-medium leading-5 text-gray-700"
      {...props}
    >
      {label}
    </label>
  )
}

export default FormLabel
