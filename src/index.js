import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { ReactKeycloakProvider,useKeycloak } from "@react-keycloak/web";
import Keycloak from "keycloak-js";
import Main from './pages/main';
import reportWebVitals from './reportWebVitals';
import './index.css';
export class BuruxAuth extends Component {
  render(){
    let authClient = new Keycloak({
      "realm": "master",
      "url": "https://iam.burux.com/auth/",
      "ssl-required": "external",
      "resource": "RetailerApp",
      "public-client": true,
      "verify-token-audience": true,
      "use-resource-role-mappings": true,
      "confidential-port": 0,
      "clientId":'RetailerApp'
    })
    return (<div><ReactKeycloakProvider authClient={authClient}><Login/></ReactKeycloakProvider></div>);
  }
}
function Login(){
  const obj = useKeycloak();
  let {authenticated} = obj.keycloak;
  if(!authenticated){
    let {login} = obj.keycloak; 
    try {login()} catch{let a = '';}
    return null
  }
  let {logout,tokenParsed} = obj.keycloak;
  let {preferred_username:username,email,groups,name} = tokenParsed;
  console.log(obj.keycloak)
  return (
    <InternalLogin
      data={{username,email,groups,logout,groups,name,token:obj.keycloak.token}}
    />
  )
}
class InternalLogin extends Component{
  constructor(props){
    super(props);
    this.state = {}
  }
  logout(){
    let {data} = this.props;
    data.logout()
  }
  render(){
    let {app,urls,setting} = this.state;
    let {data} = this.props;
    let props = {
      user:{
        username:data.username,
        name:data.name
      },
      logout:()=>this.logout(),
      groups:data.groups,
    };
    return <Main logout={()=>this.logout()}/>
  }
}

ReactDOM.render(
    <BuruxAuth />
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
