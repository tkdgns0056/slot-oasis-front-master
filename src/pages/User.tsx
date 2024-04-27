import Box from '@mui/material/Box'
import { Breadcrumbs, Paper, TextField } from '@mui/material'
import Typography from '@mui/material/Typography'
import {
  GridColDef, GridEditDateCell,
  GridEditInputCell, GridEditSingleSelectCell,
} from '@mui/x-data-grid'
import { RefObject, useEffect, useRef, useState } from 'react'
import userService from '../services/userService.ts'
import paymentService from '../services/paymentService.ts'
import moment from 'moment'
import BasicTable from '../components/Table/BasicTable.tsx'
import useAlert from '../hook/useAlert.ts'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store.ts'

export default function User() {

  const userTableRef: RefObject<any> = useRef(null)
  const idRef: RefObject<HTMLInputElement> = useRef(null)
  const sellerIdRef: RefObject<HTMLInputElement> = useRef(null)
  const nameRef: RefObject<HTMLInputElement> = useRef(null)
  const [userPage, setUserPage] = useState(0)
  const [userPageSize, setUserPageSize] = useState(10)
  const [userSort, setUserSort] = useState('')
  const [userTotalCount, setUserTotalCount] = useState(0)
  const [userRows, setUserRows] = useState<any>([])

  const [paymentPage, setPaymentPage] = useState(0)
  const [paymentPageSize, setPaymentPageSize] = useState(10)
  const [paymentSort, setPaymentSort] = useState('')
  const [paymentTotalCount, setPaymentTotalCount] = useState(0)
  const [paymentRows, setPaymentRows] = useState<any>([])
  const [paymentOperator, setPaymentOperator] = useState(false)
  const roleId = useSelector((state: RootState) => state.auth.role)
  const { success } = useAlert()

  const role = useSelector((state: RootState) => state.auth.role)

  // const [open, setOpen] = useState(false)

  // const handleAddSlot = (idx: any) => {
  //   setOpen(true)
  // }

  const userColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: '아아디',
      headerAlign: 'center',
      minWidth: 150,
      editable: true,
      renderEditCell: (params) => {
        console.log(params)
        return <GridEditInputCell {...params} disabled={!!params.row.__original__} />
      },
    },
    { field: 'sellerId', headerName: '총판 아이디', headerAlign: 'center', minWidth: 150 },
    { field: 'password', headerName: '비밀번호', headerAlign: 'center', minWidth: 130, editable: true },
    { field: 'name', headerName: '이름', headerAlign: 'center', minWidth: 130, editable: true },
    {
      field: 'roleId',
      headerName: '권한',
      headerAlign: 'center',
      minWidth: 130,
      type: 'singleSelect',
      editable: true,
      valueOptions: ({ row }) => {
        if (role === 'ROLE_ADMIN') {
          return [
            {
              label: '관리자',
              value: 'ADMIN',
            },
            {
              label: '총판',
              value: 'SELLER',
            },
            {
              label: '회원',
              value: 'USER',
            },
          ]
        } else {
          return [
            {
              label: '회원',
              value: 'USER',
            },
          ]
        }
      },
    },
    {
      field: 'enabled', headerName: '사용여부', headerAlign: 'center', minWidth: 130, editable: true,
      type: 'boolean',
    },
    { field: 'memo', headerName: '메모', headerAlign: 'center', minWidth: 130, flex: 1, editable: true },
    { field: 'cuser', headerName: '등록자', headerAlign: 'center', minWidth: 100 },
    { field: 'cdate', headerName: '등록일', headerAlign: 'center', minWidth: 200 },
    { field: 'uuser', headerName: '수정자', headerAlign: 'center', minWidth: 100 },
    { field: 'udate', headerName: '수정일', headerAlign: 'center', minWidth: 200 },

  ]

  const paymentColumns: GridColDef[] = [
    {
      field: 'type',
      headerName: '키워드 유형',
      headerAlign: 'center',
      minWidth: 200,
      type: 'singleSelect',
      editable: true,
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
      renderEditCell: (params) => {
        console.log(params)
        return <GridEditSingleSelectCell {...params} disabled={!!params.row.__original__} />
      },
    },
    {
      field: 'amount', headerName: '슬롯수량', headerAlign: 'center', minWidth: 150, editable: true, type: 'number',
      preProcessEditCellProps: (params) => {
        let hasError = false

        // if (params.otherFieldsProps && params.row.remainAmount) {
        //   hasError = !(params.props.value >= (params.row.amount - params.row.remainAmount))
        // }

        if (params.props.value > 100000) {
          hasError = true
        }

        return { ...params.props, error: hasError }
      },
      //TODO 양수만 입력가능하게..
      renderEditCell: (params) => {
        return <GridEditInputCell {...params} disabled={roleId === 'ROLE_ADMIN' ? false : !!params.row.__original__} />
      },
    },
    {
      field: 'remainAmount',
      headerName: '남은수량',
      headerAlign: 'center',
      minWidth: 150,
      type: 'number',
      editable: true,
      renderEditCell: (params) => {
        return <GridEditInputCell {...params} disabled={true} />
      },
    },
    {
      field: 'startDt', headerName: '시작일자', headerAlign: 'center', minWidth: 200, editable: true, type: 'date',
      preProcessEditCellProps: (params) => {
        let hasError = false
        if (params.otherFieldsProps && params.otherFieldsProps.endDt) {
          hasError = moment(params.props.value).isAfter(moment(params.otherFieldsProps.endDt.value))
        }
        return { ...params.props, error: hasError }
      },
      renderEditCell: (params) => {
        console.log(params)
        return <GridEditDateCell {...params} disabled={!!params.row.__original__} />
      },
    },
    {
      field: 'endDt', headerName: '종료일자', headerAlign: 'center', minWidth: 200, editable: true, type: 'date',
      preProcessEditCellProps: (params) => {
        let hasError = false
        if (params.otherFieldsProps && params.otherFieldsProps.endDt) {
          hasError = moment(moment(params.otherFieldsProps.startDt.value)).isAfter(params.props.value)
        }
        return { ...params.props, error: hasError }
      },
      renderEditCell: (params) => {
        console.log(params)
        return <GridEditDateCell {...params} disabled={!!params.row.__original__} />
      },

    },
    { field: 'memo', headerName: '메모', headerAlign: 'center', minWidth: 130, flex: 1, editable: true },

  ]

  useEffect(() => {
    console.log('User Mounted!!!')
    searchUser(userPage, userPageSize, userSort)
  }, [userPage, userPageSize, userSort])

  const handleUserChangePage = (page: number, pageSize: number, sort: string) => {
    setUserPage(page)
    setUserPageSize(pageSize)
    setUserSort(sort)
  }

  const handelEnter = (e: any) => {
    if (e.key === 'Enter') {
      searchUser(userPage, userPageSize, userSort)
    }
  }

  const searchUser = async (page: number, pageSize: number, sort: string) => {

    const params = {
      id: idRef.current ? idRef.current.value : null,
      name: nameRef.current ? nameRef.current.value : null,
      sellerId: sellerIdRef.current ? sellerIdRef.current.value : null,
      page: page,
      size: pageSize,
      sort: sort,
    }

    const response = await userService.fetchPage(params)
    const payload = response.data.payload

    setUserRows(payload.content)
    setUserTotalCount(payload.totalElements)

    setUserPage(page)
    setUserPageSize(pageSize)
    setUserSort(sort)
  }


  const handleOnUserSave = async (insertRows: any[], updateRows: any[], deleteRows: any[]) => {

    const params = {
      insertList: insertRows,
      updateList: updateRows,
      deleteList: deleteRows,
    }

    await userService.save(params)
    await searchUser(userPage, userPageSize, userSort)

    success('저장되었습니다.')

  }

  const searchPayment = async (idx: number) => {

    const params = {
      userIdx: idx,
      page: paymentPage,
      size: paymentPageSize,
      sort: paymentSort,
    }

    const response = await paymentService.fetchPage(params)
    const payload = response.data.payload

    setPaymentRows(payload.content)
    setPaymentTotalCount(payload.totalElements)

    setPaymentPage(paymentPage)
    setPaymentPageSize(paymentPageSize)
    setPaymentSort(paymentSort)
  }

  const handleUserRowClick = (row: any) => {
    if (row.roleId === 'ADMIN' || row.roleId === 'SELLER') {
      setPaymentOperator(false)
    } else {
      setPaymentOperator(true)
    }

    searchPayment(row.idx)
  }

  const handlePaymentChangePage = (page: number, pageSize: number, sort: string) => {
    setPaymentPage(page)
    setPaymentPageSize(pageSize)
    setPaymentSort(sort)
  }


  const handleOnPaymentSave = async (insertRows: any[], updateRows: any[], deleteRows: any[]) => {
    const params = {
      userIdx: userTableRef.current.getSelectedRow().idx,
      deleteList: deleteRows,
      insertList: insertRows,
      updateList: updateRows,
    }

    await paymentService.save(params)
    await searchPayment(userTableRef.current.getSelectedRow().idx)

    success('저장되었습니다.')
  }
  return (
    <>
      <Box
        sx={{ pb: 2 }}
        display="flex"
        justifyContent="flex-end"
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text">Home</Typography>
          <Typography color="text.primary">회원관리</Typography>
        </Breadcrumbs>
      </Box>
      <Paper sx={{ p: 2, mb: 3 }} elevation={3}>

        <Box sx={{ display: 'flex' }}>

          <TextField inputRef={idRef} size="small" sx={{ pr: 2 }} id="outlined-basic" label="아이디" variant="outlined"
                     onKeyDown={(e) => handelEnter(e)} autoComplete={'off'} />


          <TextField inputRef={nameRef} size="small" sx={{ pr: 2 }} id="outlined-basic" label="이름" variant="outlined"
                     onKeyDown={(e) => handelEnter(e)} autoComplete={'off'} />

          {
            role === 'ROLE_ADMIN' &&
            <TextField inputRef={sellerIdRef} size="small" sx={{ pr: 2 }} id="outlined-basic" label="총판 아이디"
                       variant="outlined"
                       onKeyDown={(e) => handelEnter(e)} autoComplete={'off'} />
          }

        </Box>

      </Paper>

      <BasicTable
        ref={userTableRef}
        columns={userColumns}
        addRow={{
          id: '',
          password: '',
          name: '',
          roleId: 'USER',
          enabled: true,
          memo: '신규회원',
          test: '',
        }}
        onChange={handleUserChangePage}
        rows={userRows}
        totalCount={userTotalCount}
        onSave={handleOnUserSave}
        handleRowClick={handleUserRowClick}
        pageSize={userPageSize}
        page={userPage}
      />

      <Box sx={{ mt: 10 }}>
        <BasicTable
          columns={paymentColumns}
          addRow={{
            type: 'REWARD',
            amount: 0,
            startDt: moment().toDate(),
            endDt: moment().add(1, 'months').toDate(),
          }}
          onChange={handlePaymentChangePage}
          rows={paymentRows}
          totalCount={paymentTotalCount}
          onSave={handleOnPaymentSave}
          operatorble={paymentOperator}
          pageSize={paymentPageSize}
          page={paymentPage}
        />
      </Box>
    </>
  )
}