import React, { createContext, useEffect, useState } from 'react'
import { getAPIAuth } from '../service/apiInstance';
import useProfile from '../hooks/useProfile';

export const GroupContext = createContext(null)

const GroupContextProvider = ({children}) => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState({})
  const [groupList, setGroupList] = useState([])
  const {token} = useProfile()


  const fetchGroupList = async () => {
    try {
      const res = await getAPIAuth('group/list')
      if(res?.data?.success) {
        setGroupList(res?.data?.data)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=> {
    if(token) {
      fetchGroupList()
    }
  }, [token])


  return (
    <GroupContext.Provider value={{showOffcanvas, setShowOffcanvas, selectedGroup, setSelectedGroup, groupList, fetchGroupList}}>
      {children}
    </GroupContext.Provider>
  )
}

export default GroupContextProvider

