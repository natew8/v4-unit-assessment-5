const bcrypt = require('bcryptjs')

module.exports = {
    register: async (req, res) => {
        const db = req.app.get('db')
        const { username, password } = req.body
        const findUser = await db.user.find_user_by_username(username)
        const existingUser = findUser[0]
        if (existingUser) {
            return res.status(409).send('Username Already Taken')
        }
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(password, salt)
        const [newUser] = await db.user.create_user([username, hash, `https://robohash.org/${username}.png`])

        req.session.user = newUser
        res.status(201).send(newUser)
    },
    login: async (req, res) => {
        const db = req.app.get('db')
        const { username, password } = req.body

        const findUser = await db.user.find_user_by_username(username)
        const existingUser = findUser[0]
        if (!existingUser) {
            return res.status(404).send('Username does not exist. Register a New User')
        }
        const isAuthenticated = bcrypt.compareSync(password, existingUser.password)

        if (!isAuthenticated) {
            return res.status(403).send('Incorrect Password')
        }

        delete existingUser.hash

        req.session.user = existingUser
        res.status(200).send(existingUser)
    },

    logout: (req, res) => {
        req.session.destroy()
        res.sendStatus(200)
    },

    getUser: (req, res) => {
        if (req.session.user) {
            res.status(200).send(req.session.user)
        } else {
            res.status(404).send('No Session Found')
        }
    }
}