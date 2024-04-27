import { HashLoader } from 'react-spinners'
import './Spinner.css'
import { RootState } from '../../redux/store.ts'
import { useSelector } from 'react-redux'

export default function Spinner() {

  const show = useSelector((state: RootState) => state.spinner.show)

  return (
    <>
      {show &&
        <div className={'spinner-box'}>
          <div className={'spinner'}>
            <HashLoader color={'#128FFC'} loading={show} size={120} />
          </div>
        </div>
      }
    </>
  )
}