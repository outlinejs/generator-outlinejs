import { BaseView, BaseLayoutView } from 'outlinejs/lib/views';
import React from 'react';

export class MyLayoutView extends BaseLayoutView {
  render() {
    return <div>
      <h1>{ this.i18n.gettext('<%= applicationName %> - layout') }</h1>
      <div>{this.renderContent()}</div>
    </div>;
  }
}

export class MyContentView extends BaseView {
  render() {
    var users;
    if (this.props.users) {
      users = <ul>
        {
          this.props.users.map((user) => {
            return <li key={ user.id }>
              <a href={`mailto:${user.email}`}>{ user.displayName }</a>
            </li>;
          })
        }
      </ul>;
    }

    return <div>
      <p>{ this.props.myVar }</p>
      { users }
    </div>;
  }
}
