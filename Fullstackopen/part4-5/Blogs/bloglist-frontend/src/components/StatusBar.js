import React from 'react';
import Alert from '@material-ui/lab/Alert';

const StatusBar = (props) => {
    if(props.status) {
      return(
        <Alert variant={props.variant} severity={props.status}>
          {props.text}
        </Alert>
      )
    } else {
      return null;
    }
}

export default StatusBar