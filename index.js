import React from 'react'
import PropTypes from 'prop-types'

import SimpleMarkdown from 'simple-markdown'
import { View } from 'react-native'
import _ from 'lodash'

import initialRules from './rules'
import styles from './styles'

class Markdown extends React.Component {
  /** Post processes rules to strip out unwanted styling options
    * while keeping the default 'paragraph' and 'text' rules
    */
  postProcessRules(preRules) {
    const defaultRules = ['paragraph', 'text']
    if (this.props.whitelist.length) {
      return _.pick(preRules, _.concat(this.props.whitelist, defaultRules))
    } else if (this.props.blacklist.length) {
      return _.omit(preRules, _.pullAll(this.props.blacklist, defaultRules))
    } else {
      return preRules
    }
  }

  renderContent = () => {
    const mergedStyles = Object.assign(styles, this.props.styles)
    const rules = this.postProcessRules(
      _.merge(
        {},
        SimpleMarkdown.defaultRules,
        initialRules(mergedStyles),
        this.props.rules
      )
    )
    const child = Array.isArray(this.props.children)
      ? this.props.children.join('')
      : this.props.children
    const blockSource = child + '\n\n'
    const tree = SimpleMarkdown.parserFor(rules)(blockSource, { inline: false })
    return SimpleMarkdown.reactFor(SimpleMarkdown.ruleOutput(rules, 'react'))(
      tree
    )
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.children === nextProps.children &&
      this.props.styles === nextProps.styles
    ) {
      return false
    }
    return true
  }

  render() {
    return (
      <View style={[styles.view, this.props.styles.view]}>
        {this.renderContent(this.props.children)}
      </View>
    )
  }
}

Markdown.propTypes = {
  styles: PropTypes.any.isRequired,
  children: PropTypes.string,
  rules: PropTypes.object.isRequired,
  whitelist: PropTypes.array,
  blacklist: PropTypes.array,
}
Markdown.defaultProps = {
  styles: styles,
  children: '',
  rules: {},
  whitelist: [],
  blacklist: [],
}

export default Markdown
