import React from "react";
import "./ImageUploadButton.scss";

class ImageUploadButton extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOnFileChange(e){
    const file = e.target.files[0]
    if(!file) return;

    // const handler = this.props.onImageSelect
    const self = this;
    const reader = new FileReader();
    reader.onload = function() {
      self.props.onImageSelect(this.result)
    }
    reader.readAsDataURL(file);
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
