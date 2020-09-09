import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { closeLoginDialog } from '~/Redux/Actions'
import { connect } from "react-redux";

class Login extends React.Component {

  handleCancel = () => {
    const { closeLoginDialog } = this.props;

    closeLoginDialog();
  }

  render() {
    const { isLoginDialogOpen } = this.props;

    return (
      <Dialog open={isLoginDialogOpen}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField id="standard-basic" label="Login" />
          <TextField id="standard-basic" label="Password" />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSubscribe} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
}

const mapStateToProps = state => {
  return {
    isLoginDialogOpen: state.isLoginDialogOpen,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    closeLoginDialog: () => dispatch(closeLoginDialog()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);