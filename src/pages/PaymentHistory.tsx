import { GridColDef, GridEditDateCell, GridEditInputCell, GridEditSingleSelectCell } from '@mui/x-data-grid'
import moment from 'moment/moment'
import Box from '@mui/material/Box'
import BasicTable from '../components/Table/BasicTable.tsx'
import { Breadcrumbs } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import paymentService from '../services/paymentService.ts'

export default function PaymentHistory() {


  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState('')
  const [paymentTotalCount, setPaymentTotalCount] = useState(0)
  const [rows, setRows] = useState<any>([])

  const columns: GridColDef[] = [
    {
      field: 'type',
      headerName: '키워드 유형',
      headerAlign: 'center',
      minWidth: 200,
      type: 'singleSelect',
      valueOptions: [
        {
          label: '리워드',
          value: 'REWARD',
        },
        {
          label: '유입플',
          value: 'INFLOW',
        },
      ],
    },
    {
      field: 'amount', headerName: '슬롯수량', headerAlign: 'center', minWidth: 150, type: 'number',
    },
    {
      field: 'remainAmount',
      headerName: '남은수량',
      headerAlign: 'center',
      minWidth: 150,
      type: 'number',
    },
    {
      field: 'startDt', headerName: '시작일자', headerAlign: 'center', minWidth: 200, type: 'date',

    },
    {
      field: 'endDt', headerName: '종료일자', headerAlign: 'center', minWidth: 200, type: 'date',
    },
    {
      field: 'status', headerName: '상태', headerAlign: 'center', minWidth: 200, type: 'string', flex: 1,
      cellClassName: (params) => {
        if (params.value === '활성') {
          return 'active'
        } else {
          return 'inactive'
        }
      },
    },

  ]


  const handleChangePage = (page: number, pageSize: number, sort: string) => {
    setPage(page)
    setPageSize(pageSize)
    setSort(sort)
  }

  const searchPayment = async () => {

    const params = {
      page: page,
      size: pageSize,
      sort: sort,
    }

    const response = await paymentService.fetchHistoryPage(params)
    const payload = response.data.payload

    setRows(payload.content)
    setPaymentTotalCount(payload.totalElements)

    setPage(page)
    setPageSize(pageSize)
    setSort(sort)
  }

  useEffect(() => {
    searchPayment()
  }, [page, pageSize, sort])

  return (
    <>
      <Box
        sx={{
          pb: 2,
        }}
        display="flex"
        justifyContent="flex-end"
      >

        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text">Home</Typography>
          <Typography color="text.primary">결제내역</Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{
        '& .active': {
          color: 'green',
          fontWeight: 'bold',
        },
        '& .inactive': {
          color: 'red',
          fontWeight: 'bold',
        },
      }}>
        <BasicTable
          mode={'V'}
          height={800}
          columns={columns}
          onChange={handleChangePage}
          rows={rows}
          totalCount={paymentTotalCount}
          pageSize={pageSize}
          page={page}
          buttons={[]}
        />
      </Box>
    </>
  )
}



