import React, { Component } from 'react';
// import './App.css';
import ServicebotManage from "./forms/management-form.js"
import { Provider } from 'react-redux'
import { createStore, combineReducers} from 'redux'
import {reducer as formReducer} from 'redux-form'
import Load from "./utilities/load.js"
import '../scss/main.scss';

class App extends Component {
  render() {

      const options = (state = {currency : {value : "usd"}}, action) => {
          switch (action.type) {
              case 'SET_CURRENCY':
                  return action.filter
              default:
                  return state
          }
      }
      const loadingReducer = (state = false, action) => {
          switch(action.type){
              case "SET_LOADING" :
                  return action.is_loading;
              default:
                  return state;
          }
      };

      let store = createStore(combineReducers({
          options,
          loading : loadingReducer,
          form : formReducer,
      }));
      return (
      <div className="App">
      <Provider store={store}>
          <div>
              <Load/>
              <ServicebotManage {...this.props}/>
          </div>
        </Provider>
      </div>
    );
  }
}

export default App;
