import { useContext } from "react"
import { GroupContext } from "../context/groupContext"

export const useGroup = () => {
  const {showOffcanvas, setShowOffcanvas, selectedGroup, setSelectedGroup, groupList, fetchGroupList} = useContext(GroupContext)
  return {showOffcanvas, setShowOffcanvas, selectedGroup, setSelectedGroup, groupList, fetchGroupList}
}