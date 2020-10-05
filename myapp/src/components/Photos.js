import React, { useState, useEffect } from "react";
import axios from 'axios'
import Avatar from "@material-ui/core/Avatar";
import {Image} from 'cloudinary-react';
const Photos = ({name}) => {
  // console.log(name)
    const [data,setData] = useState({})
    useEffect(()=>{
        axios
          .get(`http://localhost:4200/photos/${name}`)
          .then((res) => {
            console.log(res.data);
            setData(res.data);
          })
          .catch((err) => console.log(err));
    },[data,name])
    return (
      <div className="post">
        {data.images ? (data.images.map((img,index) => (
          <div key={index} className="post__card">
            <div className="post__header">
              <Avatar src={data.profile} className="personicon" />
              <p> {data.username}</p>
            </div>
            <Image
              cloud_name="djj09fjos"
              publicId={img}
              height={500}
              width={500}
              className="post__image"
            />
          </div>
        ))):null}
      </div>
    );
}

export default Photos
