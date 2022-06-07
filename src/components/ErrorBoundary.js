import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StackTrace from 'stacktrace-js';
import { css } from '@emotion/css';
import { Color } from 'constants/css';
import { clientVersion } from 'constants/defaultValues';
import URL from 'constants/URL';

const token = () =>
  typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

const auth = () => ({
  headers: {
    authorization: token()
  }
});

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node,
    innerRef: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    userId: PropTypes.number,
    username: PropTypes.string,
    componentName: PropTypes.string
  };

  state = { hasError: false };

  async componentDidCatch(error, info) {
    this.setState({ hasError: true });
    const errorStack = await StackTrace.fromError(error);
    await StackTrace.report(errorStack, `${URL}/user/error`, {
      clientVersion,
      message: error.message,
      componentName: this.props.componentName,
      info: info?.componentStack,
      token: auth()?.headers?.authorization
    });
    console.log(error);
  }

  render() {
    const { children, innerRef, componentName, ...props } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return (
        <div
          style={{
            color: Color.darkerGray(),
            fontSize: '2.5rem',
            fontWeight: 'bold',
            width: '100%',
            height: '30%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div style={{ color: Color.orange() }}>
            Something went wrong! Please tell Mikey what happened to earn XP!
            {componentName
              ? ` (tell him there's something wrong with ${componentName})`
              : ''}
          </div>
          <div
            className={css`
              &:hover {
                text-decoration: underline;
              }
            `}
            style={{
              cursor: 'pointer',
              color: Color.blue(),
              fontSize: '2rem',
              marginTop: '1rem'
            }}
            onClick={() => window.location.reload()}
          >
            Tap here to reload the website (sometimes this fixes things)
          </div>
        </div>
      );
    }
    return Object.keys(props).length > 0 ? (
      <div ref={innerRef} {...props}>
        {children}
      </div>
    ) : (
      <>{children}</>
    );
  }
}
