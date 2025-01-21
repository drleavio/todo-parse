import React, { useEffect, useRef, useState } from "react";
import ShowImage from "../components/ShowImage";
import { toast } from 'react-toastify';
import Parse from "../service/parse";
import { useNavigate } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import PhotoCrop from "../components/PhotoCrop";


const Todo = () => {
  const navigate=useNavigate()
  const session=useRef(null);
  const [loading,setLoading]=useState(false);
  const [addLoading,setAddLoading]=useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const handleCropComplete = (croppedImageUrl) => {
    setCroppedImage(croppedImageUrl);
    setData({
      image:"",
    })
    
  };
  const [data, setData] = useState({
    id: "",
    text: "",
    image: "",
  });
  const [editId, setEditId] = useState("");
  const [editText, setEditText] = useState("");
  const [editImage, setEditImage] = useState("");
  const handleUpdate = (opt) => {
    setEditId(opt.id);
    setEditText(opt.attributes.text);
    setEditImage(opt.attributes.image);
  };
  const handleEdit = async (id) => {
    try {
      const Task = Parse.Object.extend("user");
      const query = new Parse.Query(Task);
      const task = await query.get(id);
      console.log("task found");
      task.set("text", editText);
      task.set("image", editImage);
      await task.save();
      toast.success('Task updated Successfully')
      console.log("updated successfully");
      setEditId(null);
      setEditText(null);
      setEditImage(null);
      await datafetch();
    } catch (error) {
      toast.error('Error updating Task')
      console.log("error updating");
    }
  };
  const [value, setValue] = useState([]);
  const [pic, setPic] = useState("");
  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  const handleDelete = async (id) => {
    // try {
    //   const response = await axios.delete(`http://localhost:3000/${id}`);
    //   setValue((prevItems) => prevItems.filter((item) => item._id !== id));
    //   console.log(response);
    // } catch (error) {
    //   console.log("error deleting ");
    // }

    try {
      const Task = Parse.Object.extend("user");
      const query = new Parse.Query(Task);
      const task = await query.get(id);
      console.log("task found");
      task.set("show", false);
      await task.save();
      toast.success('task deleted successfully')
      console.log("deleted successfully");
      await datafetch();
    } catch (error) {
      toast.error('error doing task deletion')
      console.log("error deleting");
    }
  };

  const [showImg, setShowImg] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("file size is greater then 2MB");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Invalid file type. Only JPEG and PNG are allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setData({
          ...data,
          [e.target.name]: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("file size is greater then 2MB");
        return;
      }
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Invalid file type. Only JPEG and PNG are allowed.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setEditImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleClick = async () => {
    // try {
    //   const response = await axios.post("http://localhost:3000", data);
    //   setValue((prevItems) => [...prevItems, response.data]);
    //   await datafetch();
    //   setData({
    //     text: "",
    //     image: "",
    //   });
    //   console.log(response, "sent successfully");
    // } catch (error) {
    //   console.log("error occured");
    // }
    const newdata = Parse.Object.extend("user");
    const newuser = new newdata();

    newuser.set("text", data.text);
    newuser.set("image", croppedImage);
    newuser.set('userid',session.current.id)
    try {
      setAddLoading(true)
      const response = await newuser.save();
      toast.success('task added successfully')
      setData({
        text: "",
      });
      setCroppedImage(null)
      await datafetch();
      console.log("data sent successfully", response);
    } catch (error) {
      toast.error('error adding task')
      console.log("error sending data", error);
    }finally{
      setAddLoading(false)
    }
  };
  
  const datafetch = async () => {
    // try {
    //   const response = await axios.get("http://localhost:3000");
    //   console.log(response);
    //   setValue(response.data);
    //   console.log("value", value);
    // } catch (error) {
    //   console.log("error fetching data");
    // }
    const Product = Parse.Object.extend("user");
      const query = new Parse.Query(Product);
      
    try {
      const userSession=Parse.User.current();
      if(!userSession){
        navigate('/')
      }
      session.current=userSession;
      console.log('session',session.current.id);
      
      query.equalTo('userid',userSession.id)
      console.log('userid',userSession);
     
      const response = await query.find();

      console.log(response);
      setValue(response);
      
    } catch (error) {
      console.log("error fetching data", error);
    }
  };
  const logout=async()=>{
    try {
      setLoading(true)
      await Parse.User.logOut();
      session.current=null
      toast.success('loggedout successfully')
      navigate('/')
      console.log("User logged out!");
    } catch (error) {
      toast.error('error doing logout')
      console.error("Error while logging out:", error.message);
    }finally{
      setLoading(false)
    }
  }
  useEffect(() => {
    datafetch();
  }, []);
  const [imgId,setImgId]=useState(null);
  return (
    <div
      className="container-fluid w-100 d-flex  flex-column bgc-div"
      style={{
        height: "100vh",
        width: "100vw",
        overflowY: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexDirection: "column",
        }}
      >
        <div className="d-flex align-items-center justify-content-start  text-white w-100 p-3">
         <div className="w-75 d-flex align-items-center justify-content-center flex-column">

         <h1 className="w-100 p-0 m-0 f-div">User</h1>
        
         <h1 className="w-100 p-0 m-0 fs-div">You are what you do</h1>
         </div>
        {
          session &&  <div className="w-25 d-flex align-items-center justify-content-end">
          <button className="px-3 py-2 rounded border-0 text-white d-flex align-items-center justify-content-center gap-2" style={{backgroundColor:"black"}} onClick={logout}>
            {loading && <MoonLoader size={15} color="white"/>}
            Logout</button>
         </div>
        }
        </div>
        <div
          className="d-flex  flex-column w-100 gap-2"
          style={{ overflowY: "auto", height: "100%" }}
        >
          <div className="w-100 d-flex align-items-center justify-content-center flex-column gap-2" >
            {value
              ? value?.map((opt) => {
                  return opt.attributes.show ? (
                    <div
                      key={opt.id}
                      className="media-div d-flex align-items-center justify-content-center py-2 px-2 rounded gap-2 bgc-ele"
                      
                    >
                      {editId === opt.id ? (
                        <>
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <div>
                              <input
                                type="text"
                                value={editText}
                                className="px-3 py-2 rounded"
                                onChange={(e) => setEditText(e.target.value)}
                              />
                            </div>
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setPic(editImage);
                              }}
                            >
                              {editImage && (
                                <img
                                  src={editImage}
                                  alt="preview"
                                  style={{ height: "50px", width: "100px" }}
                                />
                              )}
                              <div style={{ textAlign: "center" }}>
                                <label
                                  htmlFor="file-input-edit"
                                  style={styles.customButton}
                                >
                                  Choose File
                                </label>
                                <input
                                  id="file-input-edit"
                                  type="file"
                                  name="image"
                                  accept="image/*"
                                  style={styles.hiddenInput}
                                  onChange={handleEditImageChange}
                                  className="py-2 px-2 rounded border-1"
                                />
                              </div>
                            </div>
                            <div>
                              <button
                                className="px-3 py-2 rounded bg-primary border-0"
                                onClick={() => handleEdit(editId)}
                              >
                                update
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-100 d-flex align-items-center justify-content-center gap-2" >
                            <div className="d-flex align-items-center justify-content-center text-white">
                              {opt.attributes.text}
                            </div>
                            <div
                              style={{ cursor: "pointer"}}
                              onClick={() => {
                                setShowImg(true);
                                setPic(opt.attributes.image);
                                setImgId(opt.id);
                              }}
                            >
                              {imgId== opt.id && showImg && (
                               
                                <ShowImage setImgId={setImgId} image={pic} setShowImg={setShowImg} setPic={setPic}/>
                                
                              )}
                              {opt.attributes.image && (
                                <img
                                  src={opt.attributes.image}
                                  alt="preview"
                                  style={{ height: "50px", width: "100px" }}
                                />
                              )}
                            </div>
                          </div>
                          <button
                            className="px-3 py-2 rounded bg-primary border-0"
                            onClick={() => handleUpdate(opt)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(opt.id)}
                            className="px-3 py-2 rounded bg-primary border-0"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  ) : null;
                })
              : null}
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center flex-column w-100">
          <div className="d-flex align-items-center justify-content-center gap-2 my-3  media-div">
            <input
              type="text"
              name="text"
              onChange={handleChange}
              value={data.text}
              className="py-2 px-2 rounded border-1 w-75 bgc-ele"
            />
            <div style={{ textAlign: "center" }}>
              <label htmlFor="file-input" style={styles.customButton}>
                Choose File
              </label>
              <input
                id="file-input"
                type="file"
                name="image"
                accept="image/*"
                style={styles.hiddenInput}
                onChange={handleImageChange}
                className="py-2 px-2 rounded border-1"
              />
            </div>
            <button
              onClick={handleClick}
              className="px-3 py-2 rounded border-0 d-flex align-items-center justify-content-center gap-2 text-white"
             style={{backgroundColor:"black"}}
            >
              {addLoading && <MoonLoader size={15} color="white"/>}
              Add
            </button>
          </div>
          <div style={{position:"absolute", bottom:"200px",right:"300px", height:"200px", width:"200px"}}>
            {
              data.image &&
              <PhotoCrop imageSrc={data.image} setImageSrc={setData} onCropComplete={handleCropComplete} />
            }
            {croppedImage && (
              <img
                src={croppedImage}
                alt="preview"
                style={{ height: "200px", width: "200px" }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  hiddenInput: {
    display: "none", 
  },
  customButton: {
    display: "inline-block",
    backgroundColor: "#4CAF50",
    color: "white",
    padding: "10px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "12px",
    transition: "background-color 0.3s ease",
  },
  customButtonHover: {
    backgroundColor: "#45a049", 
  },
};

export default Todo;
