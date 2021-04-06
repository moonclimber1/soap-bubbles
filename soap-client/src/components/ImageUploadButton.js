import React from "react";
import "./ImageUploadButton.scss";

class ImageUploadButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOnFileChange(e){
    const file = e.target.files[0]
    if(!file) return;

    const handler = this.props.onImageSelect
    const reader = new FileReader();
    reader.onload = function() {
      handler(this.result)
    }
    reader.readAsDataURL(file);

    // const img = new Image()
    // img.src = URL.createObjectURL(e.target.files[0]);
    // img.onload = () => {
    //   URL.revokeObjectURL(img.src)
    // };
    // if (img) this.props.onImageSelect(img)

    // img.onload = () => {
    //   this.image = img
    //   console.log("img loaded", this.image)
    // };
    // img.src = imagePath;

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
        <label for="upload-input">Bild auswählen</label>
      </div>
    );
  }
}

export default ImageUploadButton;
