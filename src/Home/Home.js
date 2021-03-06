import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import AWS from 'aws-sdk';
import config from '../config';

class Home extends Component {
  login() {
    this.props.auth.login();
  }

  getAWSCredentials() {
    this.props.auth.updateAWSCredentials();
  }

  uploadImage() {
    const files = document.getElementById('photoupload').files;
    if (!files.length) {
      return alert('Please choose a file to upload first.');
    }

    const identityID = AWS.config.credentials.data.SubjectFromWebIdentityToken;

    const file = files[0];
    const fileName = file.name;
    const photoKey = `${config.app}/${identityID}/${fileName}`;

    const s3 = new AWS.S3({
      params: {
        region: 'us-west-2',
        Bucket: config.bucket,
        credentials: AWS.config.credentials
      }
    });

    s3.upload({
      Key: photoKey,
      Body: file
    }, function(err, data) {
      if (err) {
        return alert('There was an error uploading your photo: ', err.message);
      }
      alert('Successfully uploaded photo.');
    });
  }

  render() {
    const { isAuthenticated } = this.props.auth;
    return (
      <div className="container">
        {
          isAuthenticated() && (
            <h4>
              You are logged in!
            </h4>
          )
        }
        {
          !isAuthenticated() && (
            <h4>
              You are not logged in! Please{' '}
              <a
                style={{ cursor: 'pointer' }}
                onClick={this.login.bind(this)}
              >
                Log In
              </a>
              {' '}to continue.
            </h4>
          )
        }

        <p style={{ top: '10px'}}>Step 2: Get AWS Credentials, wait for the popup window</p>
        <Button bsStyle="primary" className="btn-margin"
                onClick={this.getAWSCredentials.bind(this)}>
          Get AWS Credentials
        </Button>

        <p style={{ top: '10px'}}>Step 3: Choose File</p>
        <input id="photoupload" type="file" accept="image/*" style={{ margin: '20px'}}/>

        <p style={{ top: '10px'}}>Step 4: Upload file, wait for the popup window</p>
        <Button bsStyle="primary" className="btn-margin"
                onClick={this.uploadImage.bind(this)}>
          Upload
        </Button>

      </div>
    );
  }
}

export default Home;
