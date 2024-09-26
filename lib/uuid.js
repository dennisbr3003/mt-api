isEmpty = obj => {
    return Object.keys(obj).length === 0
}    

generateUUID = () => { 
    var d = new Date().getTime(); // Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16; // random number between 0 and 16
        if(d > 0){ // Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else { // Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

encodeBase64Url = (value) => {
    buffer = Buffer.from(value)
    return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}
  
decodeBase64Url = (value) => {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
    return Buffer.from(base64, 'base64').toString()
}

module.exports = { isEmpty, generateUUID, encodeBase64Url, decodeBase64Url}