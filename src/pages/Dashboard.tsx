import { Breadcrumbs, FormControl, InputLabel, MenuItem, Paper, Select, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SlotCount from '../components/Common/SlotCount.tsx'
import { GridColDef, GridEditInputCell } from '@mui/x-data-grid'
import { RefObject, useEffect, useRef, useState } from 'react'
import BasicTable from '../components/Table/BasicTable.tsx'
import userService from '../services/userService.ts'
import useAlert from '../hook/useAlert.ts'
import slotService from '../services/slotService.ts'
import paymentService from '../services/paymentService.ts'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store.ts'


export default function Dashboard() {

  const tableRef: RefObject<any> = useRef(null)

  const userIdRef: RefObject<HTMLInputElement> = useRef(null)
  const typeRef: RefObject<HTMLInputElement> = useRef(null)
  const productRef: RefObject<HTMLInputElement> = useRef(null)
  const nameRef: RefObject<HTMLInputElement> = useRef(null)
  const keywordRef: RefObject<HTMLInputElement> = useRef(null)
  const msRef: RefObject<HTMLInputElement> = useRef(null)
  const categoryRef: RefObject<HTMLInputElement> = useRef(null)
  const midRef: RefObject<HTMLInputElement> = useRef(null)
  const memoRef: RefObject<HTMLInputElement> = useRef(null)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sort, setSort] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [rows, setRows] = useState<any>([])
  const [amount, setAmount] = useState<any>({
    ALL: { total: 0, used: 0 },
    INFLOW: { total: 0, used: 0 },
    REWARD: { total: 0, used: 0 },
  })
  const [buttons, setButtons] = useState<string[]>([])
  const [searchSlotType, setSearchSlotType] = useState('ALL')
  const role = useSelector((state: RootState) => state.auth.role)


  const { success } = useAlert()

  const columns: GridColDef[] = [
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
    },
    { field: 'name', headerName: '상품링크', headerAlign: 'center', minWidth: 150, editable: true },
    { field: 'productName', headerName: '상품명', headerAlign: 'center', minWidth: 150, editable: true },
    { field: 'keyword', headerName: '검색 키워드', headerAlign: 'center', minWidth: 130, editable: true },
    { field: 'ms', headerName: 'MS값', headerAlign: 'center', minWidth: 130, editable: true },
    { field: 'category', headerName: '카테고리 번호', headerAlign: 'center', minWidth: 130, editable: true },
    { field: 'mid', headerName: 'MID값', headerAlign: 'center', minWidth: 130, editable: true },
    { field: 'slotCount', headerName: '슬롯 개수', headerAlign: 'center', type: 'number', minWidth: 130, editable: true },
    { field: 'memo', headerName: '메모', headerAlign: 'center', minWidth: 130, editable: true, flex: 1 },
    { field: 'cuser', headerName: '등록자', headerAlign: 'center', minWidth: 100 },
    { field: 'cdate', headerName: '등록일', headerAlign: 'center', minWidth: 200 },
    { field: 'uuser', headerName: '수정자', headerAlign: 'center', minWidth: 100 },
    { field: 'udate', headerName: '수정일', headerAlign: 'center', minWidth: 200 },

  ]
//
  const handleChangePage = (page: number, pageSize: number, sort: string) => {
    setPage(page)
    setPageSize(pageSize)
    setSort(sort)
  }

  const handleOnSlotSave = async (insertRows: any[], updateRows: any[], deleteRows: any[]) => {

    const params = {
      insertList: insertRows,
      updateList: updateRows,
      deleteList: deleteRows,
    }

    await slotService.save(params)
    await searchSlot(page, pageSize, sort, searchSlotType)
    await searchAmount()

    success('저장되었습니다.')

  }

  const searchSlot = async (page: number, pageSize: number, sort: string, type: string) => {

    console.log(typeRef.current)
    console.log(searchSlotType)

    const params = {
      type: type === 'ALL' ? '' : type,
      name: nameRef.current?.value,
      productName: productRef.current?.value,
      keyword: keywordRef.current?.value,
      ms: msRef.current?.value,
      category: categoryRef.current?.value,
      mid: midRef.current?.value,
      memo: memoRef.current?.value,
      userId: userIdRef.current?.value,
      page: page,
      size: pageSize,
      sort: sort,
    }

    const response = await slotService.fetchPage(params)
    const payload = response.data.payload

    setRows(payload.content)
    setTotalCount(payload.totalElements)

    setPage(page)
    setPageSize(pageSize)
    setSort(sort)
  }

  const searchAmount = async () => {
    paymentService.fetchAmountByType().then((res) => {
      let amountMap = res.data.payload
      const all = { total: 0, used: 0 }

      Object.keys(amountMap).forEach(key => {
        all.total += amountMap[key].total
        all.used += amountMap[key].used
      })

      amountMap = {
        ...amount,
        ...amountMap,
        ALL: all,
      }

      console.log(amountMap)
      setAmount(amountMap)
    })
  }

  // useEffect(() => {
  //   searchSlot(page, pageSize, sort)
  //   console.log('useEffect1')
  //   searchAmount()
  // }, [])

  // useEffect(() => {
  //   console.log('useEffect2')
  //   searchAmount()
  // }, [rows])

  useEffect(() => {
    role && (role.includes('ROLE_ADMIN') || role.includes('ROLE_SELLER')) ? setButtons(['save', 'delete', 'delete-cancel']) : setButtons(['add', 'save', 'delete', 'delete-cancel'])
  }, [])

  useEffect(() => {
    console.log('useEffect3')
    searchSlot(page, pageSize, sort, searchSlotType)
    searchAmount()
  }, [page, pageSize, sort])

  const handelEnter = (e: any) => {
    if (e.key === 'Enter') {
      searchSlot(page, pageSize, sort, searchSlotType)
    }
  }

  const handelChangeSlotType = (e: any) => {
    setSearchSlotType(e.target.value)
    searchSlot(page, pageSize, sort, e.target.value)
  }
//1

  return (
    <>
      <Box
        sx={{ pb: 2 }}
        display="flex"
        justifyContent="flex-end"
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text">Home</Typography>
          <Typography color="text.primary">대시보드</Typography>
        </Breadcrumbs>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        <SlotCount title={'전체'} total={amount['ALL'].total} current={amount['ALL'].used} />
        <SlotCount title={'유입플'} total={amount['INFLOW'].total} current={amount['INFLOW'].used} />
        <SlotCount title={'리워드'} total={amount['REWARD'].total} current={amount['REWARD'].used} />
      </Box>

      <Paper sx={{ p: 2, mb: 3 }} elevation={3}>

        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {/*TODO 셀렉트 컴포넌트로 빼자*/}
          <FormControl>
            <InputLabel id="demo-simple-select-label">슬롯 유형</InputLabel>
            <Select
              inputRef={typeRef}
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              sx={{ margin: 1, minWidth: 210 }}
              size={'small'}
              value={searchSlotType}
              label="슬롯 유형"
              onChange={handelChangeSlotType}
            >
              <MenuItem value={'ALL'}>전체</MenuItem>
              <MenuItem value={'INFLOW'}>유입플</MenuItem>
              <MenuItem value={'REWARD'}>리워드</MenuItem>
            </Select>
          </FormControl>

          {
            role && (role.includes('ROLE_ADMIN') || role.includes('ROLE_SELLER')) &&
            <TextField inputRef={userIdRef} size="small" id="outlined-basic" label="회원 아이디" variant="outlined"
                       sx={{ margin: 1 }}
                       onKeyDown={(e) => handelEnter(e)} autoComplete={'off'} />

          }

          <TextField inputRef={nameRef} size="small" id="outlined-basic" label="슬롯링크" variant="outlined"
                     sx={{ margin: 1 }}
                     onKeyDown={(e) => handelEnter(e)} autoComplete={'off'} />

          <TextField inputRef={productRef} size="small" id="outlined-basic" label="상품명" variant="outlined"
                     sx={{ margin: 1 }}
                     onKeyDown={(e) => handelEnter(e)} autoComplete={'off'} />

          <TextField inputRef={keywordRef} size="small" id="outlined-basic" label="검색 키워드" variant="outlined"
                     sx={{ margin: 1 }}
                     onKeyDown={(e) => handelEnter(e)} autoComplete={'off'} />

          <TextField inputRef={msRef} size="small" id="outlined-basic" label="MS값" variant="outlined"
                     sx={{ margin: 1 }}
                     onKeyDown={(e) => handelEnter(e)} autoComplete={'off'} />

          <TextField inputRef={categoryRef} size="small" id="outlined-basic" label="카테고리 번호" variant="outlined"
                     sx={{ margin: 1 }}
                     onKeyDown={(e) => handelEnter(e)} autoComplete={'off'} />

          <TextField inputRef={midRef} size="small" id="outlined-basic" label="MID 값" variant="outlined"
                     sx={{ margin: 1 }}
                     onKeyDown={(e) => handelEnter(e)} autoComplete={'off'} />

          <TextField inputRef={memoRef} size="small" id="outlined-basic" label="메모" variant="outlined"
                     sx={{ margin: 1 }}
                     onKeyDown={(e) => handelEnter(e)} autoComplete={'off'} />

        </Box>
      </Paper>


      <BasicTable
        height={600}
        ref={tableRef}
        columns={columns}
        addRow={{
          // type: 'REWARD',
          // name: '',
          // productName: '',
          // keyword: '',
          // ms: '',
          // category: '',
          // mid: '',
          // memo: '',
          // slotCount: 0,
          type: 'REWARD',
          name: 'aa',
          productName: 'aa',
          keyword: 'aa',
          ms: 'aa',
          category: 'a',
          mid: 'aa',
          memo: 'aa',
          slotCount: 5,
        }}
        onChange={handleChangePage}
        rows={rows}
        buttons={buttons}
        totalCount={totalCount}
        onSave={handleOnSlotSave}
        pageSize={pageSize}
        page={page}
      />
    </>
  )
}