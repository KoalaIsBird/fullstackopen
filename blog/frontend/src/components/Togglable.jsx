import { useState, forwardRef, useImperativeHandle } from 'react'

const Togglable = forwardRef(({ buttonLabel, children }, refs) => {
  const [showContent, setShowContent] = useState(false)

  const contentStyle = { display: showContent ? '' : 'none' }
  const showContentButtonStyle = { display: showContent ? 'none' : '' }

  const toggleVisibility = () => {
    setShowContent(!showContent)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={contentStyle}>
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
      <div style={showContentButtonStyle}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
