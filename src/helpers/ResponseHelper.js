const sendSuccess = (res, data, status = 200) => {
    res.status(status).json({ status: 'success', data })
}

const sendBadRequest = (res, mensagem) => {
    res.status(400).json({ status: 'error', message: mensagem })
}

const sendError = (res, error, status = 500) => {
    res.status(status).json({ status: 'error', message: error.message })
}

export default {
    sendSuccess,
    sendError
}