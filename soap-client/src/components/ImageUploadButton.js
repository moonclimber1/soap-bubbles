import React from "react";
import "./ImageUploadButton.scss";
import Compress from 'compress.js'

class ImageUploadButton extends React.Component {
  constructor(props) {
    super(props);

    this.imageCompressor = new Compress();
  }

  handleOnFileChange(e){
    const file = e.target.files[0]
    if(!file) return;

    const self = this;
    this.imageCompressor.compress([file], {
      size: 0.5,
      quality: 0.75,
      maxWidth: 800,
      maxHeight: 800,
      resize: true,
    }).then((images) => {
      const img = images[0]
      self.props.onImageSelect(`${img.prefix}${img.data}`)
      console.log("🚀 Image sucessfully compressed", img)
    });




    // // const handler = this.props.onImageSelect
    // const self = this;
    // const reader = new FileReader();
    // reader.onload = function() {
    //   self.props.onImageSelect(this.result)
    // }
    // reader.readAsDataURL(file);
  }

  render() {
    return (
      <div className="image-upload-button">
        <input
          type="file"
          id="upload-input"
          accept="image/*"
          onChange={(e) => this.handleOnFileChange(e)}
          hidden
        />
        <label for="upload-input">Memories</label>
      </div>
    );
  }
}

export default ImageUploadButton;
