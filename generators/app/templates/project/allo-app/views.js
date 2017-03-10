import React from 'react';

import { views } from 'outlinejs';
import { components } from 'outlinejs';
import { routing } from 'outlinejs'

let Link = components.Link;


class MenuView extends components.BaseComponent {
  render() {
    return <ul className="nav nav-pills pull-right">
      <li className={routing.Utils.activeCssClass('allo:home', this.request)}><Link state="allo:home">Home</Link></li>
      <li className={routing.Utils.activeCssClass('allo:other', this.request)}><Link state="allo:other" params={{detailId: 1}}>Other Page</Link></li>
    </ul>;
  }
}

export class AlloView extends views.BaseView {
  render() {
    return <div className="container">
      <div className="header">
        <MenuView />
        <h3 className="text-muted">pippo</h3>
      </div>

      <div className="jumbotron">
        <h1>'Allo, 'Allo!</h1>
        <p className="lead">Always a pleasure scaffolding your apps.</p>
        <p><a className="btn btn-lg btn-success" href="#">Splendid!</a></p>
      </div>

      <div className="row marketing">
        <div className="col-lg-6">
          <h4>HTML5 Boilerplate</h4>
          <p>HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.</p>
          <h4>Sass</h4>
          <p>Sass is the most mature, stable, and powerful professional grade CSS extension language in the world.</p>
          <h4>Bootstrap</h4>
          <p>Sleek, intuitive, and powerful mobile first front-end framework for faster and easier web development.</p>
        </div>
      </div>

      <div className="footer">
        <p>♥ from the Yeoman team</p>
      </div>
    </div>;
  }
}

export class AlloDetailView extends views.BaseView {
  render() {
    return <div className="container">
      <div className="header">
        <MenuView />
        <h3 className="text-muted">pippo</h3>
      </div>

      <div className="jumbotron">
        <h1>'Allo, 'Allo!</h1>
        <p className="lead">Always a pleasure scaffolding your apps.</p>
        <p><a className="btn btn-lg btn-success" href="#">Splendid!</a></p>
      </div>

      <div className="row marketing">
        <div className="col-lg-6">
          <p>
            Say 'allo to another page with a parameter id equal to <strong>{this.props.detail}</strong>
          </p>
          <img src={this.static('allo-app/media/images/yeoman.png')} />
        </div>
      </div>

      <div className="footer">
        <p>♥ from the Yeoman team</p>
      </div>
    </div>;
  }
}
