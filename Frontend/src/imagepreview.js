imgInp.onchange = evt => {
    const [file] = imgInp.files
    if (file) {
      image.src = URL.createObjectURL(file)
    }
  }