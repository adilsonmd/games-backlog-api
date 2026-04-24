const sendSuccess = (res, data, status = 200) => {
    res.status(status).json({ status: 'success', data })
}

const sendError = (res, error, status = 500) => {
    res.status(status).json({ status: 'error', message: error.message })
}

module.exports = {
    sendSuccess,
    sendError
}