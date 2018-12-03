const parse = require('parse-sel')
const isObject = require('is-plain-object')
const flatten = require('lodash.flattendeep')
const selfClosing = require('self-closing-tags').voidElements

const v = (selector = '', attrs = {}, ...children) => {
  const tokens = parse(selector)
  const { id, className } = tokens
  const tagName = (tokens.tagName || '').toLowerCase()

  if (tagName === '!') {
    return `<!-- ${flatten(children).join(' ')} -->`
  }

  const attributes = []

  if (!isObject(attrs)) {
    children.unshift(attrs)
    attrs = {}
  }

  for (const key of Object.keys(attrs)) {
    if (attrs[key] === undefined) continue
    attributes.push(`${key}="${attrs[key].toString().replace(/"/g, '\\"')}"`)
  }

  if (id || attrs.id) {
    attributes.push(`id="${id || attrs.id}"`)
  }

  const classes = [...new Set(className.split(' '))].filter(c => {
    return c !== ''
  }).join(' ')

  if (classes || attrs.class) {
    attributes.push(`class="${classes || attrs.class}"`)
  }

  const tag = {
    open: `<${tagName} ${attributes.join(' ')}>`,
    close: `</${tagName}>`,
  }

  if (selfClosing.includes(tagName)) {
    return tag.open
  }

  if (children.length) {
    return tag.open + flatten(children).join(' ') + tag.close
  }

  return tag.open + tag.close
}

module.exports = v
