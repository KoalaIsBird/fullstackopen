import { forwardRef, useImperativeHandle, useState } from 'react'

const Togglable = forwardRef(({ buttonLabel, children }, refs) => {
  const [showContent, setShowContent] = useState(false)

  const contentStyle = { display: showContent ? '' : 'none' }
  const showContentButtonStyle = { display: showContent ? 'none' : '' }

  const toggleVisibility = () => {
    setShowContent(!showContent)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={contentStyle}>
        {children}
        <button className='btn btn-sm btn-secondary my-2' onClick={toggleVisibility}>
          Cancel
        </button>
      </div>
      <div style={showContentButtonStyle}>
        <button className='btn btn-sm btn-primary' onClick={toggleVisibility}>
          {buttonLabel}
        </button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
