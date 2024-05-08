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

function verifToken(vector) {
    const jwtPattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]*$/;

    for (const element of vector) {
        console.log(element);
        if (element.toString().includes('.') && !element.toString().match(jwtPattern)) {
            console.log('Invalid JWT:', element);
            return false;
        }
    }
    return true;
}

module.exports = { verifChar, verifToken };