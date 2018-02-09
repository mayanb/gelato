import React from 'react'
import hoistStatics from 'hoist-non-react-statics'

export default function paramsToProps(WrappedComponent) {
  class ComponentWithParamsAsProps extends React.Component {
    static displayName = `withParamsAsProps(${WrappedComponent.displayName ||
      WrappedComponent.name})`

    render() {
      const params = this.props.navigation.state.params || {}
      return <WrappedComponent {...this.props} {...params} />
    }
  }

  return hoistStatics(ComponentWithParamsAsProps, WrappedComponent)
}
