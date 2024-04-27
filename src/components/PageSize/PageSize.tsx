import * as React from 'react'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

export default function PageSize() {
  const [value, setValue] = React.useState('20')

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: string,
  ) => {
    setValue(value)
  }

  return (
    <ToggleButtonGroup
      color="primary"
      value={value}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton sx={{ pl: 3, pr: 3 }} value="20">20</ToggleButton>
      <ToggleButton sx={{ pl: 3, pr: 3 }} value="50">50</ToggleButton>
      <ToggleButton sx={{ pl: 3, pr: 3 }} value="100">100</ToggleButton>
      <ToggleButton sx={{ pl: 3, pr: 3 }} value="500">500</ToggleButton>
    </ToggleButtonGroup>
  )
}