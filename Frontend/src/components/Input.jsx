import React from 'react'

function Input({type, name, placeholder, className}) {
  return (
    <input type={type} name={name} placeholder={placeholder} className={`input-box ${className}`} />
  )
}
// peer block w-full rounded border border-gray-200 bg-gray-50 outline-none px-3 py-2 leading-6 transition-all duration-200 ease-linear focus:text-primary
export default Input