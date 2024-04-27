import { Card, Chip, LinearProgress, Stack } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useEffect, useState } from 'react'

interface SlotCountProps {
  title: string;
  total?: number;
  current?: number;
}


export default function SlotCount(prop: SlotCountProps) {


  const [title, setTitle] = useState(prop.title)
  const [total, setTotal] = useState(prop.total ? prop.total : 0)
  const [current, setCurrent] = useState(prop.current ? prop.current : 0)

  useEffect(() => {
    setTotal(prop.total ? prop.total : 0)
    setCurrent(prop.current ? prop.current : 0)
  }, [prop.total, prop.current])


  return (
    <Card variant="elevation" sx={{ minWidth: 250, marginRight: 2, marginBottom: 2 }}>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h6" component="div">
            <b>{title}</b>
          </Typography>
          <Typography gutterBottom variant="h6" component="div">
            {current} / {total}
          </Typography>

        </Stack>
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" value={(current / total) * 100} />
        </Box>
      </Box>
      <Divider />

    </Card>

  )
}