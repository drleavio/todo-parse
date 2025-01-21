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
        <div className="d-flex align-items-center justify-content-center  text-white w-100 p-3">
         <div className=" media-width d-flex align-items-center justify-content-center flex-column">

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
        <div className="d-flex align-items-center justify-content-center w-100">
          <div className="d-flex align-items-center justify-content-start media-width-second p-3 bgc-eles my-3 rounded-3 text-white">
              <div className="d-flex align-items-center justify-content-center flex-column px-3">
                <div className="fs-6">TUE</div>
                <div className="fs-1 fw-bold">21</div>
                <div>January</div>
              </div>
              <div className="w-100 mx-5">
                <div>Join video meetings with one tap</div>
                <div className="d-flex align-items-center justify-content-start gap-3 text-primary">
                  <div className="d-flex align-items-center justify-content-center gap-1">
                    <img style={{height:"15px", width:"15px"}} src="data:image/jpeg;base64,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" alt="" />
                    Connect google calendar
                    </div>
                  <div className="d-flex align-items-center justify-content-center gap-1">
                    <img style={{height:"15px", width:"15px"}} src="data:image/jpeg;base64,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" alt="" />
                    Connect outlook calendar
                    </div>
                </div>
              </div>
          </div>
        </div>
        <div
          className="d-flex  flex-column w-100 gap-2 my-3"
          style={{ overflowY: "auto", height: "100%" }}
        >
          <div className="w-100 d-flex align-items-center justify-content-center flex-column gap-2" >
            {value
              ? value?.map((opt) => {
                  return opt.attributes.show ? (
                    <div
                      key={opt.id}
                      className="media-div d-flex align-items-center justify-content-center py-2 px-2 rounded-3 gap-2 bgc-ele"
                      
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
