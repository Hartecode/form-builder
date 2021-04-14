const fs = require('fs-extra')

const src = 'build'
const dest = 'cartridge/static/build'

// With async/await:
async function example (src, dest) {
  try {
    await fs.remove(dest)
    await fs.move(src, dest)
    console.log('Build successfully moved to cartridge static folder')
  } catch (err) {
    console.error(err)
  }
}

example(src, dest)