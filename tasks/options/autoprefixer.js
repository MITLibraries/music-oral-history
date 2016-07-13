module.exports = {
  options: {
    browsers: ['last 4 version']
  },
  multiple_files: {
    expand: true,
    flatten: true,
    src: 'css/build/*.css',
    dest: 'css/build/prefixed/'
  }
}
