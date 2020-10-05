import React,{useState,useEffect} from 'react'
import axios from 'axios'
import {Image} from 'cloudinary-react';
import '../Post.css'
import Avatar from "@material-ui/core/Avatar";
const Post = () => {
    const [data,setData] = useState([])
    useEffect(()=>{
        axios
          .get("http://localhost:4200/home")
          .then((res) => {
            setData(res.data);
            // console.log(res)
          })
          .catch((err) => {
            console.log(err);
          });
    },[data])
    return (
      <div className="post">
        {data.map((info) =>
          info.images.map((src) => (
            <div className="post__card">
              <div className="post__header">
                <Avatar src={info.profile} className="personicon" />
                <p> {info.username}</p>
              </div>
              <Image
                cloud_name="djj09fjos"
                publicId={src}
                height={500}
                width={500}
                className="post__image"
              />
            </div>
          ))
        )}
      </div>
    );
}

export default Post
