import React from 'react'

function Label({labelName, htmlFor}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-semibold text-slate-800">{labelName}</label>
  )
}

export default Label