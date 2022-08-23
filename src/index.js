import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import { ReactKeycloakProvider,useKeycloak } from "@react-keycloak/web";
import Keycloak from "keycloak-js";
import Main from './pages/main';
import Register from './components/register/register';
import reportWebVitals from './reportWebVitals';
import './index.css';
import RVD from 'react-virtual-dom';
export class BuruxAuth extends Component {
  render(){
    let {goToLanding} = this.props; 
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
    return (<div><ReactKeycloakProvider authClient={authClient}><Login goToLanding={goToLanding}/></ReactKeycloakProvider></div>);
    // return <Main />;
  }
}
function Login(props){
  const obj = useKeycloak();
  let {authenticated} = obj.keycloak;
  if(!authenticated){
    let {login} = obj.keycloak; 
    try {login()} catch{let a = '';}
    return null
  }
  let {tokenParsed} = obj.keycloak;
  let {preferred_username:username,email,groups,name} = tokenParsed;
  return (
    <InternalLogin
      data={{username,email,groups,logout:()=>{
        obj.keycloak.logout();
        //props.goToLanding()
      },groups,name,token:obj.keycloak.token}}
    />
  )
}
class InternalLogin extends Component{
  constructor(props){
    super(props);
    this.state = {init:true}
  }
  logout(){
    let {data} = this.props;
    data.logout()
  }
  render(){
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
