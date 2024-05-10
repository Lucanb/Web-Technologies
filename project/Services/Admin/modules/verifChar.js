function verifChar(vector) {
    for (element of vector)
    {
        const onlyLettersPattern = /^[A-Za-z0-9]+(?: [A-Za-z0-9]+)*$/;
        console.log(element)
        if (!element.toString().match(onlyLettersPattern)) {
            return false;
        }
    }
    return true;
}

function verifPass(vector) {
    // for (const element of vector) {
    //     const pattern = /^[A-Za-z0-9@#\/$.]+(?:[A-Za-z0-9@#\/$.]*[A-Za-z0-9@#\/$.]+)*$/;
    //     console.log(element);
    //     if (element && !element.toString().match(pattern)) {
    //         console.log('ELEMENT : ', element);
    //         return false;
    //     }
    // }
    return true;
}
module.exports = {verifChar,verifPass};