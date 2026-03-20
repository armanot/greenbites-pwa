export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      const result = reader.result
      if (typeof result !== 'string') {
        reject(new Error('Failed to read file'))
        return
      }

      const base64 = result.split(',')[1]
      resolve(base64)
    }

    reader.onerror = () => reject(new Error('Failed to convert file to base64'))
    reader.readAsDataURL(file)
  })
}