export const resErrors = (res, statusCode, message) => {
    res.status(statusCode).json({
        error: true,
        message: message
    })
};


