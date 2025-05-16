import React, { useEffect, useState } from 'react'
import { Pencil, UserRoundPlus, X } from 'lucide-react'
import useProfile from '../hooks/useProfile'
import Avatar from './Avatar'
import { formDataAuth, getAPIAuth } from '../service/apiInstance'
import { toast } from 'react-toastify'
import { useFormik } from 'formik'
import { groupValidationSchema } from '../validationSchema/groupSchema'
import { useGroup } from '../hooks/useGroup'

const CreateGroupOffcanvas = () => {
  const {showOffcanvas, setShowOffcanvas, selectedGroup, fetchGroupList} = useGroup()
  const {user} = useProfile()
  const [friendList, setFriendList] = useState([])
  const [imagePreview, setImagePreview] = useState("")

  useEffect(()=> {
    if(selectedGroup?._id) {

      // formik.setFieldValue("image", [user?._id])
      formik.setFieldValue("groupName", selectedGroup?.groupName)
      formik.setFieldValue("groupDescription", selectedGroup?.groupDescription)
  
      const idCollection = selectedGroup?.participants?.map(item => {
        return item?._id
      })
    
      formik.setFieldValue("participants", [user?._id, ...idCollection ])
    }

  }, [selectedGroup])

  const handleSubmit = async (values) => {
    const formdata = new FormData();
    formdata.append("groupName", values?.groupName)
    formdata.append("groupDescription", values?.groupDescription)
    formdata.append("image", values?.image ? values?.image : '')

    values?.participants?.map(el => (
      formdata.append("participants", el)
    ))

    if(selectedGroup?._id) {
      formdata.append("chatId", selectedGroup?._id)
    }

    let res 

    if(selectedGroup?._id) {
      res = await formDataAuth("group/edit", formdata);
    } else {
      res = await formDataAuth("group/create", formdata);
    }


    if(res?.data?.success) {
      toast.success(res?.data?.message)
      formik.resetForm()
      setShowOffcanvas(false)
      fetchGroupList()
      if(selectedGroup?._id) {
        localStorage.setItem("ACTIVE_CHAT_USER", JSON.stringify(res?.data?.data))
      }
    }
  }

  useEffect(()=> {
    formik.setFieldValue("participants", [user?._id])
  }, [user?._id])

  
  const formik = useFormik({
    initialValues : {
      image : "",
      groupName : "", 
      groupDescription : '',
      participants : []
    },
    validationSchema : groupValidationSchema,
    onSubmit : handleSubmit,
    enableReinitialize : false
  })
  

  const handleChange = (e)=> {
    e.preventDefault();
    const file = e.target.files && e.target.files?.[0];

    if(file) {
      formik.setFieldValue("image", file);
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const fetchFriendsList = async () => {
      try {
        const res = await getAPIAuth(`user/getUserFriends`)
        if(res?.data?.success) {
          setFriendList(res?.data?.data)
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(()=> {
      if(showOffcanvas) {
        fetchFriendsList()
      }
    }, [showOffcanvas])

    const handleParticipants = (id) => {
      const currentParticipants = formik.values.participants;
      const updated = currentParticipants.includes(id)
        ? currentParticipants.filter(el => el !== id)
        : [...currentParticipants, id];
    
      formik.setFieldValue("participants", updated);
    }


  return (
    <>
      {/* <div onClick={()=> setShowOffcanvas(true)} className="flex items-center justify-center size-12 min-h-12 rounded-full overflow-hidden bg-[#2B04A6] sticky right-4 lg:right-0 bottom-4 ml-auto cursor-pointer z-20 text-white">
        <UserRoundPlus size={20} />
      </div> */}
      <div className={`z-50 fixed bg-white shadow w-full lg:w-[30rem] h-dvh top-0 right-0 overflow-hidden flex flex-col transition-all duration-500 ${showOffcanvas ? '' : "translate-x-full"}`}>
        <div className="header p-5 border-b border-[#EAECF0] flex justify-between items-center">
          <div className="text-lg font-semibold capitalize">
            {selectedGroup?._id ? "Edit" : "Create"} Group
          </div>
          <button onClick={()=> setShowOffcanvas(false)} className='cursor-pointer flex items-center justify-center'>
            <X size={20} />
          </button>
        </div>
        <div className="body p-5 flex-1 h-full overflow-y-auto pb-0">
          <form onSubmit={formik.handleSubmit} className="flex items-center justify-center flex-col">
            <input className='hidden' id='groupImg' type="file" accept='image/*' onChange={handleChange} />
            <div className="relative size-40 rounded-full bg-[#2B04A6]/5 flex items-center justify-center uppercase font-semibold text-2xl">
              <div className="size-full overflow-hidden rounded-full flex items-center justify-center">
                {
                  imagePreview ? <img src={imagePreview} className='size-full object-cover' alt='image'/> :
                  selectedGroup?.groupImge ? <img src={selectedGroup?.groupImge} className='size-full object-cover' alt='image'/> :
                  user?.avtarUrl ? 
                    <img src={"./assets/img/dummyGroup.png"} className='size-full object-cover' alt='image'/>
                  : ""
                }
              </div>
              <label htmlFor="groupImg" className='size-5 bg-white rounded-full flex items-center justify-center absolute right-0 bottom-6 shadow'>
                <Pencil size={12} />
              </label>
            </div>
            <div className="customInput w-full">
              <input 
                  type="text" 
                  name='groupName'
                  id='groupName'
                  placeholder='Group name'
                  value={formik?.values?.groupName || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-control ${formik.touched.groupName && formik.errors.groupName ? 'inputError' : ''}`}
                />
                {formik.touched.groupName && formik.errors.groupName && (
                  <div className="errorText">{formik.errors.groupName}</div>
                )}
            </div>
            <div className="mt-3 w-full">
              <textarea 
                  name='groupDescription'
                  id='groupDescription'
                  placeholder='Description (optional)'
                  value={formik?.values?.groupDescription || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`form-control border border-slate-200 w-full flex-1 p-3 min-h-24 max-h-32 rounded-lg text-sm `}
                />
            </div>
            <div className="w-full">
              <div className="mb-2 text-sm font-medium mt-4">Participants</div>
              <ul className='flex flex-col gap-2'>
                {
                  friendList?.length ?
                    friendList?.map(item => (
                      <li key={item?.friendDetails?._id} onClick={()=> handleParticipants(item?.friendDetails?._id)} className={`p-2 border border-slate-200 w-full rounded-md flex justify-between items-center cursor-pointer hover:bg-[#2B04A6]/5 [&.active]:bg-[#2B04A6]/5 ${formik?.values?.participants?.includes(item?.friendDetails?._id) ? "active" : ''}`}>
                        <div className="text-sm">{item?.friendDetails?.userName}</div>
                        <div className="size-4 border border-slate-200 rounded-full flex items-center justify-center">
                          {
                            formik?.values?.participants?.includes(item?.friendDetails?._id) ? 
                              <div className="size-2 bg-[#2B04A6] rounded-full"></div>
                            : ""
                          }
                        </div>
                      </li>
                    ))
                  : "No friends"
                }
              </ul>
            </div>
            <div className=" mt-3 w-full sticky bottom-0 left-0 py-5 bg-white">
              <button type='submit' className='commonBtn w-full'>
                {selectedGroup?._id ? "Edit" : "Create"}
              </button>
            </div>

          </form>
        </div>
      </div>
      {
        showOffcanvas ? <div onClick={()=> setShowOffcanvas(false)} className="fixed bg-black/25 top-0 left-0 h-dvh w-full z-10 "></div> : ''
      }
    </>
  )
}

export default CreateGroupOffcanvas