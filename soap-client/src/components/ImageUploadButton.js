import React from "react";
import "./ImageUploadButton.scss";

class ImageUploadButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="image-upload-button">
        <input
          type="file"
          id="upload-input"
          accept="image/*"
          onChange={(e) => this.props.onImageSelect(e.target.files[0])}
          hidden
        />
        <label for="upload-input">Bild auswählen</label>
      </div>
    );
  }
}

export default ImageUploadButton;
