import React, { Component } from 'react';
import FotoItem from './Foto';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';
import TimelineApi from '../logicas/TimelineApi';
import {connect} from 'react-redux';

class Timeline extends Component {

    constructor(props){
      super(props);      
      this.login = this.props.login;      
    }

    carregaFotos(){  
      let urlPerfil;

      if(this.login === undefined) {
        urlPerfil = `https://instalura-api.herokuapp.com/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
      } else {
        urlPerfil = `https://instalura-api.herokuapp.com/api/public/fotos/${this.login}`;
      } 

      this.props.lista(urlPerfil);                  
    }

    componentDidMount(){
      this.carregaFotos();
    }

    componentWillReceiveProps(nextProps){
      if(nextProps.login !== this.login){          
        this.login = nextProps.login;
        this.carregaFotos();
      }
    }

    render(){        
        return (
        <div className="fotos container">
        <ReactCSSTransitionGroup
          transitionName="timeline"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
            {
              this.props.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.props.like} comenta={this.props.comenta}/>)
            }               
        </ReactCSSTransitionGroup>        
 
        </div>            
        );
    }
}

const mapStateToProps = state => {
  return {fotos : state.timeline} //now we going to build it on the server side. not going to be build in front side anymore
};

const mapDispatchToProps = dispatch => {
  return {
    like : (fotoId) => {
      dispatch(TimelineApi.like(fotoId));
    },
    comenta : (fotoId,textoComentario) => {
      dispatch(TimelineApi.comenta(fotoId,textoComentario))
    },
    lista : (urlPerfil) => {
      dispatch(TimelineApi.lista(urlPerfil));      
    }

  }
}

const TimelineContainer = connect(mapStateToProps,mapDispatchToProps)(Timeline);

export default TimelineContainer