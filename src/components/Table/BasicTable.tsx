import {
  DataGrid,
  GridColDef,
  GridFilterModel,
  GridRenderCellParams, GridRowParams, GridRowSelectionModel,
  GridSortModel,
  useGridApiRef,
} from '@mui/x-data-grid'
import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'
import { Button, ButtonProps, Stack, styled } from '@mui/material'
import { blue, green, purple, red } from '@mui/material/colors'

import { AddBox, Done, DoNotDisturbOn, PublishedWithChanges } from '@mui/icons-material'
import _ from 'lodash'
import './BasicTable.css'
import moment from 'moment'
import useAlert from '../../hook/useAlert.ts'


interface BasicTableProps {
  columns: GridColDef[];
  addRow?: any;
  onChange: (page: number, pageSize: number, sort: string) => any;
  rows: any;
  page: number;
  pageSize: number;
  totalCount: number;
  handleRowClick?: (row: GridRowParams) => any;
  onSave?: (insertRows: any[], updateRows: any[], deleteRows: any[]) => any;
  height?: number
  operatorble?: boolean
  buttons?: string[]
  mode?: string
}

const DeleteButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: red[500],
  '&:hover': {
    backgroundColor: red[700],
  },
}))

const UnDeleteButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: blue[500],
  '&:hover': {
    backgroundColor: blue[700],
  },
}))


const AddButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: green[500],
  '&:hover': {
    backgroundColor: green[700],
  },
}))

const SaveButton = styled(Button)<ButtonProps>(({ theme }) => ({
  color: theme.palette.getContrastText(purple[500]),
  backgroundColor: purple[500],
  '&:hover': {
    backgroundColor: purple[700],
  },
}))


const renderStatus = (s: string | undefined) => {
  if (s === 'E') {
    return <Done color="disabled" />
  } else if (s === 'U') {
    return <PublishedWithChanges color="secondary" />
  } else if (s === 'D') {
    return <DoNotDisturbOn color="error" />
  } else if (s === 'A') {
    return <AddBox color="success" />
  }
  return null
}


const BasicTable = forwardRef((props: BasicTableProps, tableRef) => {

  const apiRef = useGridApiRef()
  const [paginationModel, setPaginationModel] = useState({
    page: props.page,
    pageSize: props.pageSize,
  })
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] })
  const [sortModel, setSortModel] = useState<GridSortModel>([])
  const [rows, setRows] = useState<any[]>([])
  const [columns, setColumns] = useState<GridColDef[]>([])
  const [rowCount, setRowCount] = useState(0)
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])
  const [selectedRow, setSelectedRow] = useState<any>(null)
  const [rowCountIndex, setRowCountIndex] = useState<number>(1)
  const operatorble = useMemo(() => {
    return props.operatorble === undefined ? true : props.operatorble
  }, [props.operatorble])
  const mode = useMemo(() => {
    return props.mode === undefined ? 'E' : props.mode
  }, [props.mode])


  const { warning } = useAlert()
  const buttons = useMemo(() => {

    const defaultButton: string[] = ['save', 'delete', 'delete-cancel', 'add']

    return props.buttons === undefined ? defaultButton : props.buttons
  }, [props.buttons])


  const handleUnDeleteRow = () => {
    const selectedRows = apiRef.current.getSelectedRows()
    if (selectedRows.size === 0) {
      return
    }
    selectedRows.forEach((row) => {
      if (row.__status__ === 'D') {
        apiRef.current.updateRows([{ __index__: row.__index__, __status__: 'E' }])
      }
    })

  }
  const handleAddRow = () => {

    const newRowIndex = 0 // 새로운 행을 맨 위에 추가하기 위한 인덱스
    const newRow: any = Object.assign({}, props.addRow)
    newRow.__status__ = 'A'
    newRow.__index__ = apiRef.current.getRowsCount() + rowCountIndex
    newRow.__original__ = false

    // 기존 행들을 가져옴
    const currentRows = apiRef.current.getAllRowIds().map(id => apiRef.current.getRow(id))

    // 새 행을 맨 위에 추가
    currentRows.unshift(newRow)

    // 업데이트된 행으로 데이터 그리드 업데이트
    apiRef.current.setRows(currentRows)

    // 선택된 행 업데이트
    setRowSelectionModel([newRow.__index__, ...rowSelectionModel])

    // 행 인덱스 업데이트
    setRowCountIndex(rowCountIndex + 1)

  }

  const handleSaveRow = async () => {

    if (props.onSave === undefined) return

    let editCommited = true

    apiRef.current.getAllRowIds().forEach((id) => {
      if (apiRef.current.getRowMode(id) === 'edit') {
        warning('저장할 수 없습니다. 수정중인 행이 있습니다.')
        editCommited = false
      }
    })

    if (!editCommited) {
      return
    }


    const selectedRows = apiRef.current.getSelectedRows()
    const insertRows: any[] = []
    const updateRows: any[] = []
    const deleteRows: any[] = []


    selectedRows.forEach((row) => {
      if (row.__status__ === 'A') {
        insertRows.push(row)
      } else if (row.__status__ === 'U') {
        updateRows.push(row)
      } else if (row.__status__ === 'D') {
        deleteRows.push(row)
      }
    })


    if (!(insertRows.length === 0 && updateRows.length === 0 && deleteRows.length === 0)) {
      await props.onSave(insertRows, updateRows, deleteRows)
      setPaginationModel({ ...paginationModel, page: 0 })
      setRowSelectionModel([])
      //TODO 강제 업데이트 방법을 찾아야함
      // insertRows.forEach((row) => {
      //   apiRef.current.updateRows([{ __index__: row.__index__, __status__: 'E' }])
      // })
      //
      // updateRows.forEach((row) => {
      //   apiRef.current.updateRows([{ __index__: row.__index__, __status__: 'E' }])
      // })
      //
      // deleteRows.forEach((row) => {
      //   apiRef.current.updateRows([{ __index__: row.__index__, _action: 'delete' }])
      // })
    }
  }

  const handleProcessRowUpdate = (newRow: any, oldRow: any) => {
    console.log('handleProcessRowUpdate', newRow)
    if (newRow.__status__ === 'E' || newRow.__status__ === 'D') {
      if (!_.isEqual(newRow, oldRow)) {
        console.log(newRow, oldRow)
        newRow.__status__ = 'U'
        setRowSelectionModel([newRow.__index__, ...rowSelectionModel])
      }
    }
    return newRow
  }

  const handleCellKeyDown = (params: any, event: any) => {
    if (event.key !== 'Enter') {
      event.stopPropagation()
    }

  }

  const handleDeleteRow = () => {

    const selectedRows = apiRef.current.getSelectedRows()
    if (selectedRows.size === 0) {
      return
    }

    selectedRows.forEach((row) => {
      if (row.__status__ === 'E' || row.__status__ === 'U') {
        apiRef.current.updateRows([{ __index__: row.__index__, __status__: 'D' }])
      } else if (row.__status__ === 'A') {
        apiRef.current.updateRows([{ __index__: row.__index__, _action: 'delete' }])
      }
    })
  }

  const handleRowClick = (params: GridRowParams) => {
    console.log(selectedRow)
    if (selectedRow && (selectedRow.__index__ === params.row.__index__)) return
    if (params.row && params.row.__status__ === 'A') return
    setSelectedRow(params.row)
    props.handleRowClick?.(params.row)
  }

  const handleRowClassName = (params: GridRowParams) => {
    if ((selectedRow?.__index__ === params.row.__index__)) {
      return 'BasicTable-row-selected'
    }
    return ''
  }

  /**
   * 최초 한번만 실행
   */
  useEffect(() => {
    if (mode === 'E') {
      const columns: GridColDef[] = [{
        field: '__status__', headerName: '상태', minWidth: 10, align: 'center', sortable: false, filterable: false,
        renderCell: (params: GridRenderCellParams<any, any>) => {
          return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              {
                renderStatus(params.value)
              }
            </div>
          )
        },
      }, ...props.columns]
      setColumns(columns)
    } else {
      setColumns(props.columns)
    }
  }, [])

  useEffect(() => {
    const rows = props.rows.map((row: any, index: number) => {
      for (const key in row) {
        if (key.endsWith('Dt')) {
          row[key] = moment(row[key]).toDate() // moment로 변환 후 toDate로 데이트로 변환
        }
      }
      return { __index__: index, __status__: 'E', ...row, __original__: true }
    })
    setRows(rows)
    setRowCount(props.totalCount)
  }, [props.rows, props.totalCount])

  /**
   * 페이지 변경, 페이지 사이즈 변경, 정렬 변경시 호출
   */
  useEffect(() => {

    const page = paginationModel.page
    const size = paginationModel.pageSize
    const sort = sortModel.map(item => `${item.field},${item.sort}`).join(',')
    setRowSelectionModel([])
    props.onChange(page, size, sort)

  }, [paginationModel, sortModel, filterModel])

  useImperativeHandle(tableRef, () => ({
    getSelectedRow: () => {
      return selectedRow
    },
  }))


  return (
    <div style={{ height: props.height ? props.height : 400, width: 'calc(100vw - 290px)' }}>
      <Stack direction="row" justifyContent="end" spacing={1} sx={{ mb: 1 }}>
        {
          buttons.includes('add') &&
          <AddButton disabled={!operatorble} variant="contained" size="small" onClick={handleAddRow}>
            행 추가
          </AddButton>
        }

        {
          buttons.includes('delete-cancel') &&
          <UnDeleteButton disabled={!operatorble} variant="contained" size="small" onClick={handleUnDeleteRow}>
            삭제 취소
          </UnDeleteButton>
        }

        {
          buttons.includes('delete') &&
          <DeleteButton disabled={!operatorble} variant="contained" size="small" onClick={handleDeleteRow}>
            선택 삭제
          </DeleteButton>
        }

        {
          buttons.includes('save') &&
          <SaveButton disabled={!operatorble} variant="contained" size="small" onClick={handleSaveRow}>
            저장
          </SaveButton>
        }


      </Stack>
      <DataGrid
        apiRef={apiRef}
        getRowId={(row: any) => row.__index__}
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: 'primary.light',
          '& .MuiDataGrid-columnHeader': { backgroundColor: '#00008b' },
          '& .MuiDataGrid-columnHeaderTitle': { color: 'white', fontWeight: 'bolder' },
          '.MuiDataGrid-checkboxInput': { color: 'darkturquoise' },
          '.MuiCheckbox-root.Mui-checked': { color: 'darkturquoise' },
          '.Mui-checked': { color: 'darkturquoise' },

          '.MuiDataGrid-sortIcon': { color: 'white' },
          '.MuiDataGrid-menuIconButton': { color: 'white' },
          '& .MuiDataGrid-cell--editing': {
            backgroundColor: 'rgb(255,215,115, 0.19)',
            color: '#1a3e72',
            '& .MuiInputBase-root': {
              height: '100%',
            },
          },
          '& .Mui-error': {
            backgroundColor: `rgb(255, 215, 115, 0.5)`,
            color: 'red',
          },
        }}
        rows={rows}
        rowCount={rowCount}
        columns={columns}
        rowHeight={40}
        pageSizeOptions={[10, 20, 50, 100]}
        checkboxSelection={mode === 'E'}
        disableColumnFilter
        disableRowSelectionOnClick
        pagination
        onRowClick={handleRowClick}
        paginationMode={'server'}
        filterMode={'server'}
        sortingMode={'server'}
        editMode={'row'}
        rowSelectionModel={rowSelectionModel}
        onRowSelectionModelChange={setRowSelectionModel}
        onCellKeyDown={handleCellKeyDown}
        processRowUpdate={handleProcessRowUpdate}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        onSortModelChange={setSortModel}
        onFilterModelChange={setFilterModel}
        getRowClassName={handleRowClassName}
        localeText={{ noRowsLabel: '데이터가 없습니다.' }}
      />

    </div>
  )
})

export default BasicTable