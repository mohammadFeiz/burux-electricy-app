import React,{Component,createRef} from 'react';
import AIOButton from './../../npm/aio-button/aio-button';
import {Icon} from '@mdi/react';
import {mdiMenu,mdiClose,mdiChevronRight,mdiChevronLeft,mdiCheckCircleOutline,mdiAlertOutline,mdiInformationOutline, mdiChevronDown} from '@mdi/js';
import RVD from './../../npm/react-virtual-dom/react-virtual-dom';
import $ from 'jquery';
import './index.css';

export default class ReactSuperApp extends Component {
    constructor(props){
      super(props);
      let {touch = 'ontouchstart' in document.documentElement} = this.props;
      this.state = {
        navId:this.getNavId(),
        confirm:false,
        touch,
        popups:[],
        sideOpen:false,
        addPopup:(o)=>this.setState({popups:this.state.popups.concat(o)}),
        removePopup:()=>{
          let {popups} = this.state;
          popups.pop();
          this.setState({popups})
        },
        setConfirm:this.setConfirm.bind(this),
      }
      if(props.getActions){props.getActions({...this.state})}
    }
    setConfirm(obj){
      let confirm;
      let {type} = obj;
      if(type){
        let {text,subtext} = obj;
        let path,color;
        if(type === 'success'){path = mdiCheckCircleOutline; color = 'green';}
        else if(type === 'error'){path = mdiClose; color = 'red';}
        else if(type === 'warning'){path = mdiAlertOutline; color = 'orange';}
        else if(type === 'info'){path = mdiInformationOutline; color = 'dodgerblue';}
        let body = (
          <RVD
            layout={{
              column:[
                {size:12},
                {html:<Icon path={path} size={2}/>,style:{color},align:'vh'},
                {size:12},
                {html:text,style:{color},align:'vh'},
                {size:12},
                {html:subtext,align:'vh',className:'size10'}
              ]
            }}
          />
        )
        confirm = {text:body,style:{background:'#fff',height:'fit-content',width:360},buttons:[{text:'بستن'}],backClose:true}
      }
      else{confirm = obj;}
      this.setState({confirm})
    }
    getNavId(){
      let {navs,navId} = this.props;
      if(!navs){return false}
      if(navId){
        let res = this.getNavById(navId);
        if(res !== false){return navId}
      }
      if(!navs.length){return false}
      return navs[0].id;
    }
    navigation_layout() {
      let {navs = [],navHeader,rtl} = this.props;
      if(!navs.length){return false}
      let {touch,navId} = this.state;
      let props = {navs,navHeader,navId,onChange:(navId)=>this.setState({navId}),touch,rtl}
      return {html: (<Navigation {...props}/>)};
    }
    page_layout(nav){
      let {body} = this.props;
      return {flex:1,column:[this.header_layout(nav),{flex:1,html:<div className='rsa-body'>{body(this.state)}</div>}]} 
    }
    header_layout(nav){
        let {touch} = this.state;
        let {header,sides = []} = this.props;
        return {
          style:{flex:'none'},align:'v',className:'rsa-header' + (touch?' touch-mode':''),
          row:[
            {show:!!sides.length,html:<Icon path={mdiMenu} size={1}/>,align:'vh',attrs:{onClick:()=>this.setState({sideOpen:!this.state.sideOpen})}},
            {show:!!sides.length,size:12},
            {flex:1,html:nav.headerText || nav.text,className:'rsa-header-title'},
            {show:!!header,html:()=>header(this.state)} 
          ]
        }
    }
    getNavById(id){
      let {navs} = this.props;
      this.res = false;
      this.getNavById_req(navs,id);
      return this.res;
    }
    getNavById_req(navs,id){
        if(this.res){return;}
        for(let i = 0; i < navs.length; i++){
            if(this.res){return;}
            let nav = navs[i];
            let {show = ()=>true} = nav;
            if(!show()){continue}
            if(nav.id === id){this.res = nav; break;}
            if(nav.navs){this.getNavById_req(nav.navs,id);}
        }
    }
    render() {
      let {confirm,popups,removePopup,touch,sideOpen,navId} = this.state;
      let {navs,sides = [],sideId,rtl,sideHeader,style} = this.props;
      let nav = navs?this.getNavById(navId):false;
      return (
        <>
          {touch && <RVD layout={{style,className: 'rsa' + (rtl?' rtl':' ltr') + (popups.length?' has-opened-popup':''),column: [this.page_layout(nav),this.navigation_layout()]}}/>}
          {!touch && <RVD layout={{style,className: 'rsa' + (rtl?' rtl':' ltr') + (popups.length?' has-opened-popup':''),row: [this.navigation_layout(),this.page_layout(nav)]}}/>}
          {popups.length && popups.map((o,i)=><Popup key={i} {...o} index={i} removePopup={()=>removePopup()} rtl={rtl}/>)}
          {confirm && <Confirm {...confirm} onClose={()=>this.setState({confirm:false})}/>}
          {sides.length && sideOpen && <SideMenu sideHeader={sideHeader} sides={sides} sideId={sideId} sideOpen={sideOpen} rtl={rtl} onClose={()=>this.setState({sideOpen:false})}/>}
          <Loading />
        </>
      );
    }
  }
  class Navigation extends Component {
    state = {openDic:{}}
    header_layout() {
      let {navHeader} = this.props;
      if(!navHeader){return {size:12}}
      return {html: navHeader()};
    }
    items_layout(navs,level){
      return {
        gap:12,flex:1,scroll:'v',
        column:navs.filter(({show = ()=>true})=>show()).map((o,i)=>{
          if(o.navs){
            let {openDic} = this.state;
            let open = openDic[o.id] === undefined?true:openDic[o.id]
            let column = [this.item_layout(o,level)]
            if(open){column.push(this.items_layout(o.navs,level + 1))}
            return {gap:12,column}
          }
          return this.item_layout(o,level)
        })
      }
    }
    toggle(id){
      let {openDic} = this.state;
      let open = openDic[id] === undefined?true:openDic[id]
      this.setState({openDic:{...openDic,[id]:!open}})
    }
    item_layout({id,icon,text,navs},level = 0){
      let {onChange,navId,rtl} = this.props;
      let {openDic} = this.state;
      let open = openDic[id] === undefined?true:openDic[id]
      let active = id === navId;
      return {
        size:36,className:'rsa-navigation-item' + (active?' active':''),attrs:{onClick:()=>navs?this.toggle(id):onChange(id)},
        row:[
          {size:level * 16},
          {size:24,html:navs?<Icon path={open?mdiChevronDown:(rtl?mdiChevronLeft:mdiChevronRight)} size={1}/>:'',align:'vh'},
          {show:!!icon,size:48,html:()=>icon(active),align:'vh'},
          {html:text,align:'v'}
        ]
      }
    }
    bottomMenu_layout({icon,text,id}){
      let {navId,onChange} = this.props;
      let active = id === navId;
      return {
          flex:1,className:'rsa-bottom-menu-item' + (active?' active':''),attrs:{onClick:()=>onChange(id)},
          column:[
            {flex:1},
            {show:!!icon,html:()=>icon(active),align:'vh'},
            {html:text,align:'vh',className:'rsa-bottom-menu-item-text'},
            {flex:1}
          ]
      }
    }
    render() {
      let {touch,navs} = this.props;
      if(touch){
        return (<RVD layout={{className: 'rsa-bottom-menu',row: navs.map((o)=>this.bottomMenu_layout(o))}}/>)
      }
      return (<RVD layout={{className: 'rsa-navigation',column: [this.header_layout(),this.items_layout(navs,0)]}}/>);
    }
  }
  class SideMenu extends Component {
    state = {open:false}
    header_layout() {
      let {sideHeader} = this.props;
      if(!sideHeader){return false}
      return {align: 'vh',gap:12,html: sideHeader()};
    }
    items_layout(){
      let {sides,onChange,sideId} = this.props;
      return {
        gap:12,
        column:sides.map(({icon,text,id},i)=>{
          let active = id === sideId;
          return {
            size:36,className:'rsa-sidemenu-item' + (active?' active':''),attrs:{onClick:()=>onChange(id)},
            row:[
              {show:!!icon,size:48,html:icon(active),align:'vh'},
              {html:text,align:'v'}
            ]
          }
        })
      }
    }
    
    componentDidMount(){
      setTimeout(()=>this.setState({open:true}),0)  
    }
    render() {
      let {onClose,rtl} = this.props;
      let {open} = this.state;
      return (
          <RVD 
            layout={{
              className: 'rsa-sidemenu-container' + (open?' open':'') + (rtl?' rtl':' ltr'),
              row:[
                {className: 'rsa-sidemenu',column: [{size:24},this.header_layout(),{size:24},this.items_layout()]},
                {flex:1,attrs:{onClick:()=>onClose()}}
              ]
            }} 
          />
      );
    }
  }

  class Loading extends Component{
    cubes2(obj = {}){
      var {count = 5,thickness = [5,16],delay = 0.1,borderRadius = 0,colors = ['dodgerblue'],duration = 1,gap = 3} = obj;
      let Thickness = Array.isArray(thickness)?thickness:[thickness,thickness];
      let getStyle1 = (i)=>{
        return {
          width:Thickness[0],height:Thickness[1],background:colors[i % colors.length],margin:`0 ${gap/2}px`,
          animation: `${duration}s loadingScaleY infinite ease-in-out ${i * delay + 1}s`,
          borderRadius:borderRadius + 'px'
        }
      }
      let chars = ['B','U','R','U','X']
      let items = [];
      for(var i = 0; i < count; i++){
        items.push(<div key={i} className='cube' style={getStyle1(i)}>{chars[i]}</div>)
      }
      return (
        <div className="rect" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'transparent'}}>
          {items}
        </div>
      )
    }
    
    render(){
      return (
        <div className='loading'>
          {this.cubes2({thickness:[12,90],colors:['transparent']})}
        </div>
      );
    }
  }
  export function splitNumber(price,count = 3,splitter = ','){
    if(!price){return price}
    let str = price.toString()
    let dotIndex = str.indexOf('.');
    if(dotIndex !== -1){
        str = str.slice(0,dotIndex)
    }
    let res = ''
    let index = 0;
    for(let i = str.length - 1; i >= 0; i--){
        res = str[i] + res;
        if(index === count - 1){
            index = 0;
            if(i > 0){res = splitter + res;}
        }
        else{index++}
    }
    return res
  }
//tabs,content,onClose,title
class Popup extends Component{
    constructor(props){
      super(props);
      this.dom = createRef();
      this.state = {activeTabIndex:0};
      this.dui = 'a' + Math.random()

    }
    async onClose(){
      let {removePopup,onClose} = this.props;
      if(onClose){
        let res = await onClose();
        if(res === false){return}
        removePopup()
      }
      else{removePopup()}
    }
    header_layout(){
      let {onClose = ()=>this.onClose(),title,header,onBack,rtl} = this.props;
      if(header === false){return false}
      return {
        size:48,className:'rsa-popup-header',
        row:[
          {show:!!onBack,size:36,html:<Icon path={rtl?mdiChevronRight:mdiChevronLeft} size={1}/>,align:'vh',attrs:{onClick:()=>onBack()}},
          {flex:1,html:title,align:'v',className:'rsa-popup-title'},
          {show:!!header,html:()=><div style={{display:'flex',alignItems:'center'}}>{header()}</div>},
          {show:onClose !== false,size:36,html:<Icon path={mdiClose} size={0.8}/>,align:'vh',attrs:{onClick:()=>onClose()}}
        ]
      }
    }
    body_layout(){return {flex:1,column:[this.tabs_layout(),this.content_layout()]}}
    tabs_layout(){
      let {tabs} = this.props;
      if(!tabs){return false}
      let {activeTabIndex} = this.state;
      return {html:(<AIOButton type='tabs' options={tabs.map((o,i)=>{return {text:o,value:i}})} value={activeTabIndex} onChange={(activeTabIndex)=>this.setState({activeTabIndex})}/>)}
    }
    content_layout(){
      let {tabs,content} = this.props;
      let Content;
      if(tabs){
        let {activeTabIndex} = this.state;
        Content = content(activeTabIndex)
      }
      else {Content = content()}
      if(Content === 'loading'){return {flex:1,html:'در حال بارگزاری',align:'vh'}}
      if(Content === 'empty'){return {flex:1,html:'موردی موجود نیست',align:'vh'}}
      return {flex:1,html:<div className='rsa-popup-body'>{Content}</div>}
    }
    getClassName(){
      let {type} = this.props;
      let className = 'rsa-popup-container';
      if(type === 'fullscreen'){className += ' fullscreen'}
      if(type === 'bottom'){className += ' bottom-popup'}
      return className
    }
    backClick(e){
      let target = $(e.target);
      if(target.hasClass(this.dui)){return}
      let parents = target.parents('.rsa-popup');
      if(parents.hasClass(this.dui)){return}
      let {removePopup,onClose = ()=>removePopup(),backClose} = this.props;
      if(onClose === false){return}
      if(!backClose){return}
      onClose();
    }
    componentDidMount(){
      $(this.dom.current).animate({height: '100%',width: '100%',left:'0%',top:'0%',opacity:1}, 300);
    }
    render(){
      let {rtl} = this.props;
      return (  
        <div ref={this.dom} className={this.getClassName()} onClick={(e)=>this.backClick(e)} style={{
          left:'50%',top:'100%',height:'0%',width:'0%',opacity:0
        }}>
          <RVD 
            layout={{
              className:'rsa-popup' + (rtl?' rtl':' ltr') + (' ' + this.dui),
              style:{flex:'none'},
              column:[this.header_layout(),this.body_layout()]
            }}
          />  
        </div>
      )
    }
  }


  export class Confirm extends Component{
    constructor(props){
      super(props);
      this.dui = 'a' + Math.random();
    }
    header_layout(){
      let {onClose,title} = this.props;
      if(!title){return false}
      return {
        size:48,className:'rsa-popup-header',
        row:[
          {flex:1,html:title,align:'v',className:'rsa-popup-title'},
          {size:48,html:<Icon path={mdiClose} size={0.8}/>,align:'vh',attrs:{onClick:()=>onClose()}}
        ]
      }
    }
    body_layout(){
      let {text} = this.props;
      return {flex:1,html:text,scroll:'v',className:'rsa-popup-body'}
    }
    onSubmit(){
      let {onClose,onSubmit} = this.props;
      onSubmit();
      onClose();
    }
    footer_layout(){
      let {buttons,onClose=()=>{}} = this.props;
      return {
        gap:12,
        size:48,
        align:'v',
        style:{padding:'0 12px'},
        row:buttons.map(({text,onClick = ()=>{}})=>{
          return {html:(
            <button 
              className='rsa-popup-footer-button' 
              onClick={()=>{onClick(); onClose()}}
            >{text}</button>
          )}
        }) 
      }
    }
    backClick(e){
      let {onClose,backClose} = this.props;
      if(!backClose){return}
      let target = $(e.target);
      if(target.hasClass(this.dui)){return}
      let parents = target.parents('.rsa-popup');
      if(parents.hasClass(this.dui)){return}
      
      onClose();
    }
    render(){
      let {style = {width:400,height:300}} = this.props;
      return (  
        <div className='rsa-popup-container' onClick={(e)=>this.backClick(e)}>
          <RVD layout={{className:'rsa-popup rsa-confirm' + (' ' + this.dui),style:{flex:'none',...style},column:[this.header_layout(),this.body_layout(),this.footer_layout()]}}/>  
        </div>
      )
    }
  }