import React from 'react';
import ReactDOM from 'react-dom';
import './assets/index.scss';
import App from './components/App';

var navigator_info = window.navigator;
var screen_info = window.screen;
var uid = '' + navigator_info.mimeTypes.length;
uid += navigator_info.userAgent.replace(/\D+/g, '');
uid += navigator_info.plugins.length;
uid += screen_info.height || '';
uid += screen_info.width || '';
uid += screen_info.pixelDepth || '';

ReactDOM.render(
  <React.StrictMode>
    <App 
      uid={uid}
    />
  </React.StrictMode>,
  document.getElementById('root')
);

