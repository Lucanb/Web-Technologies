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

function verifCharMessage(vector) {
    for (element of vector)
    {
        const onlyLettersPattern = /^[A-Za-z0-9]+(?:[A-Za-z0-9]*[@#\.][A-Za-z0-9]+)*$/;
        console.log(element)
        if (!element.toString().match(onlyLettersPattern)) {
            return false;
        }
    }
    return true;
}

module.exports = {verifChar,verifCharMessage};