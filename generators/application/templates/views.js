import React from 'react';
import { views } from 'outlinejs';


export class MyLayoutView extends views.BaseLayoutView {
  render() {
    return <div>
      <h1>{ this.i18n.gettext('<%= applicationName %> - layout') }</h1>
      <div>{this.renderContent()}</div>
    </div>;
  }
}

export class MyContentView extends views.BaseView {
  render() {
    return <div>
      View content
    </div>;
  }
}
