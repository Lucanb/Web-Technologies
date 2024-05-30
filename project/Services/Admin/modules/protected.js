const JWToken = require("../modules/token");
const Token = require("../../Authentication/modules/token");
async function getTokenStatus(cookies) {
    let accessToken = null;
    let refreshToken = null;
    let status = {
        valid: false,
        message: '',
        newAccessToken: null
    };

    if (cookies) {
        const cookieObj = cookies.split(';').reduce((acc, cookie) => {
            const parts = cookie.split('=');
            acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
            return acc;
        }, {});
        accessToken = cookieObj['accessToken'];
        refreshToken = cookieObj['refreshToken'];
    }

    if (!accessToken) {
        status.message = 'Authorization cookie missing or invalid';
        return status;
    }

    try {
        const decoded = await JWToken.validate(accessToken);
        if (!decoded) {
            status.message = 'Invalid token';
            return status;
        }
        status.valid = true;
        status.message = 'Valid access token';
        return status;
    } catch (error) {
        // Attempt to validate the refresh token
        try {
            const decoded = await JWToken.validate(refreshToken);
            if (!decoded) {
                status.message = 'Invalid refresh token';
                return status;
            } else {
                const newAccessToken = await Token.generateKey({
                    userId: decoded[0].userId,
                    role: decoded[0].role,
                    username: decoded[0].username,
                    fresh: true,
                    type: 'access'
                }, {
                    expiresIn: '1h'
                });
                status.valid = true;
                status.message = 'New access token generated';
                status.newAccessToken = newAccessToken;
                return status;
            }
        } catch (error) {
            console.error('Error validating token:', error);
            status.message = 'Internal server error';
            return status;
        }
    }
}


async function getAdminTokenStatus(cookies) {
    let accessToken = null;
    let refreshToken = null;
    let status = {
        valid: false,
        message: '',
        newAccessToken: null
    };

    if (cookies) {
        const cookieObj = cookies.split(';').reduce((acc, cookie) => {
            const parts = cookie.split('=');
            acc[parts[0].trim()] = decodeURIComponent(parts[1].trim());
            return acc;
        }, {});
        accessToken = cookieObj['accessToken'];
        refreshToken = cookieObj['refreshToken'];
    }

    if (!accessToken) {
        status.message = 'Authorization cookie missing or invalid';
        return status;
    }

    try {
        const decoded = await JWToken.validate(accessToken);
        if (!decoded || decoded[0].role === false) {
            status.message = 'Invalid token';
            return status;
        }
        status.valid = true;
        status.message = 'Valid access token';
        return status;
    } catch (error) {
        // Attempt to validate the refresh token
        try {
            const decoded = await JWToken.validate(refreshToken);
            if (!decoded || decoded[0].role === false) {
                status.message = 'Invalid refresh token';
                return status;
            } else {
                const newAccessToken = await Token.generateKey({
                    userId: decoded[0].userId,
                    role: decoded[0].role,
                    username: decoded[0].username,
                    fresh: true,
                    type: 'access'
                }, {
                    expiresIn: '1h'
                });
                status.valid = true;
                status.message = 'New access token generated';
                status.newAccessToken = newAccessToken;
                return status;
            }
        } catch (error) {
            console.error('Error validating token:', error);
            status.message = 'Internal server error';
            return status;
        }
    }
}
module.exports = {getTokenStatus,getAdminTokenStatus};