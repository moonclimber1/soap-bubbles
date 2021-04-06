class ImageLibrary {

    constructor(){
        this.library = {}
    }

    addImage(bubbleId, img){
        this.library[bubbleId] = img
    }

    getImage(bubbleId){
        return this.library[bubbleId]
    }

}

export default ImageLibrary;