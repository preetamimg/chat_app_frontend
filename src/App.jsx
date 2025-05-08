import { useNavigate } from 'react-router';
import RouteComponent from './routes/Routes';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { setNavigate } from './utils/navigate';

function App() {
  const navigate = useNavigate();

  useEffect(()=> {
    setNavigate(navigate)
  }, [navigate])

  return (
    <>
      <RouteComponent/>
      <ToastContainer />
    </>
  )
}

export default App
