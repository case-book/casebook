import React from 'react';
import SockJsClient from 'react-stomp';
import PropTypes from 'prop-types';
import { getBaseURL } from '@/utils/configUtil';

class SocketClient extends React.PureComponent {
  render() {
    const base = getBaseURL();

    const { topics } = this.props;
    const { headers } = this.props;
    const { onConnect, onMessage, onDisconnect, setRef } = this.props;

    return (
      <SockJsClient
        url={`${base}/ws`}
        topics={topics}
        headers={headers}
        onMessage={onMessage}
        onConnect={onConnect}
        onDisconnect={onDisconnect}
        getRetryInterval={count => {
          return 5000 * count;
        }}
        // autoReconnect={false}
        onConnectFailure={e => {
          console.error(e);
        }}
        ref={client => {
          if (setRef) {
            setRef(client);
          }
        }}
      />
    );
  }
}

export default SocketClient;

SocketClient.defaultProps = {
  headers: {},
  setRef: null,
};

SocketClient.propTypes = {
  onMessage: PropTypes.func.isRequired,
  onConnect: PropTypes.func.isRequired,
  onDisconnect: PropTypes.func.isRequired,
  topics: PropTypes.arrayOf(PropTypes.string).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  headers: PropTypes.objectOf(PropTypes.any),
  setRef: PropTypes.func,
};
