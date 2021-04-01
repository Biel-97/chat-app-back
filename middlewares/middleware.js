const jwt = require('jsonwebtoken')

async function authenticateToken(req, res, next) {

    const authToken = req.body.token
    if (authToken == null) return res.status(401).send({ error: 'token nullo' })

    const token = authToken.split(' ')
    if (!token.length == 2) {
        return res.status(401).send({ error: 'token error' })
    }

    jwt.verify(token[1], process.env.TOKEN_HASH, (err, useres) => {
        if (err) {
            return res.send({error: 'jwt expired'})
        }
        req.user = useres
        next()
    })
}

module.exports = { authenticateToken}
