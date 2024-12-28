import * as React from "react"
import { ChevronDown } from "lucide-react"

const Select = React.forwardRef(({ children, value, onValueChange, ...props }, ref) => {
  const [open, setOpen] = React.useState(false)
  const selectRef = React.useRef(null)

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return React.Children.map(children, child => {
    if (child.type === SelectTrigger) {
      return React.cloneElement(child, {
        onClick: () => setOpen(!open),
        ref: selectRef,
        ...props
      })
    }
    if (child.type === SelectContent && open) {
      return React.cloneElement(child, {
        value,
        onValueChange: (newValue) => {
          onValueChange(newValue)
          setOpen(false)
        }
      })
    }
    return null
  })
})

const SelectTrigger = React.forwardRef(({ children, className = "", onClick }, ref) => (
  <button
    ref={ref}
    onClick={onClick}
    className={`flex items-center justify-between w-full px-3 py-2 text-sm bg-white border rounded-md shadow-sm hover:bg-gray-50 ${className}`}
  >
    {children}
    <ChevronDown className="w-4 h-4 opacity-50" />
  </button>
))

const SelectContent = ({ children, value, onValueChange }) => (
  <div className="absolute z-50 w-full min-w-[8rem] mt-1 bg-white border rounded-md shadow-lg">
    <div className="py-1">
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          selected: child.props.value === value,
          onClick: () => onValueChange(child.props.value)
        })
      )}
    </div>
  </div>
)

const SelectValue = ({ placeholder, children }) => (
  <span className="block truncate">
    {children || placeholder}
  </span>
)

const SelectItem = ({ value, children, selected, onClick }) => (
  <button
    type="button"
    className={`w-full px-3 py-2 text-sm text-left hover:bg-gray-100 ${
      selected ? 'bg-gray-100 font-medium' : ''
    }`}
    onClick={onClick}
  >
    {children}
  </button>
)

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }