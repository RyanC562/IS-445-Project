const fs = require('fs')
const path = require('path')

const filename = path.resolve(__dirname, 'users_data.json')

function getUsers() {
    try {
        const content = fs.readFileSync(filename)
        return JSON.parse(content)
    } catch (err) {
        if (err.code === 'ENOENT') {
            console.log('file not exists')
            return []
        } else {
            console.log(err)
            throw err
        }
    }
}

function saveUsers(users) {
    const myDataStr = JSON.stringify(users)
    fs.writeFileSync(filename, myDataStr)
}

module.exports = {
    getUsers,
    saveUsers
}