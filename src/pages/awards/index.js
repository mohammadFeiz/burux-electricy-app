import React, { Component } from 'react';
import getSvg from './../../utils/getSvg';
import ChanceMachin from './../../coponents/chance-machin/index';
import { Icon } from '@mdi/react';
import RVD from 'react-virtual-dom';
import AIOButton from 'aio-button';
import { mdiClose, mdiChevronRight, mdiChevronLeft } from '@mdi/js';
import './index.css';
import services from '../../services';
export default class Awards extends Component {
  constructor(props) {
    super(props);
    this.iconDictionary = {
      '1':1,//
      '2':1,'3':2,'4':8,'5':5,'6':4,'7':3,'8':7,'9':6
    }
    this.state = {
      chanceResult:false,//false, winner or looser
      chanceIndex:false,//reward index that user win it
      showUserAwards:false,
      awardIndex: 0,
      awards: [],
      userAwards:[
        { title: '10 الماس', subtitle: 'باشگاه مشتریان', date: '1400/2/2',used:true,code:'dsf56464hh' },
        { title: '1 درصد', subtitle: 'تخفیف مازاد (تا سقف 2 میلیون)', icon: 2, date: '1400/2/2',used:false,remaining:10,code:'dsf56464hh'},
        { title: '200 هزار تومن', subtitle: 'شارژ کیف پول', date: '1400/2/2',used:false,remaining:7,code:'dsf56464hh'},
        { title: '300 هزار تومن', subtitle: 'شارژ کیف پول' , date: '1400/2/2',used:false,remaining:3,code:'dsf56464hh'},
        { title: '500 هزار تومن', subtitle: 'شارژ کیف پول' , date: '1400/2/2',used:true,code:'dsf56464hh'},
        { title: '2 برابر', subtitle: 'دریافت هزینه ارسال سفارش از بازارگاه', date: '1400/2/2',used:false,remaining:1,code:'dsf56464hh'},
        { title: '50 روز', subtitle: 'خرید اعتباری با پرداخت 50 روزه', date: '1400/2/2',used:true,code:'dsf56464hh'},
        { title: '', subtitle: 'جمع آوری فوری کالاهای گارانتی', date: '1400/2/2',used:true,code:'dsf56464hh'},
      ]
    }

  }
  async getUserAwards(){
    return await services('get_user_awards');
  }
  async componentDidMount(){
    let awards = await services('get_all_awards');
    let userAwards = await this.getUserAwards();
    this.mounted = true;
    this.setState({userAwards,awards:awards.map((o)=>{
      return {...o,icon:this.iconDictionary[o.id.toString()],subtitle:o.shortDescription}
    })})
  }
  async getChanceResult(result,index){
    this.setState({chanceResult:result?'winner':'looser',chanceIndex:index});
    let {awards} = this.state;
    let res = await services('save_catched_chance',{award:awards[index],result});
    if(res){
      let userAwards = await this.getUserAwards();
      this.setState({userAwards})
    }
  }
  render() {
    if(!this.mounted){return null;}
    let { awards,chanceResult,chanceIndex,showUserAwards,userAwards } = this.state;
    let {onClose} = this.props;
    
    return (
      <>
        <RVD
        layout={{
          className: 'award-page',
          column: [
            {
              size: 96, align: 'v',className: 'award-page-header' ,
              row: [
                { flex: 1 },
                { size: 36, html: <Icon path={mdiClose} size={1} />, align: 'vh' ,attrs:{onClick:()=>onClose()}}
              ]
            },
            { html: 'جایزه روزانه', align: 'vh',style: { fontSize: 40 }},
            { size: 48, html: 'هر روز یک شانس برای برنده شدن دارید', align: 'vh',style: { fontSize: 16 } },
            { flex: 1 },
            { 
              html: (
                <ChanceMachin 
                  items={awards.map(({ icon }) => getSvg(icon))} 
                  getResult={(result,index)=>this.getChanceResult(result,index)}
                  showIndex={true}
                  manipulate={[44,60,77,4,100]}
                />
              ), 
              style: { padding: '0 24px' }, align: 'h'
            },
            { size: 24 },
            { size: 48, html: 'جایزه ها', align: 'vh',style: { fontSize: 24 } },
            {html:<AwardsPreview awards={awards} onClick={()=>this.setState({showUserAwards:true})}/>},
            { size: 36 }
          ]
        }}
      />
      {
        chanceResult !== false &&
        <div className='award-page-popup-container'>
          <RVD
            layout={{
              className:'award-page-popup',
              column:[
                {
                  size:48,
                  row:[
                    {flex:1},
                    {
                      size:36,align:'v',
                      html:<Icon path={mdiClose} size={1} />,
                      attrs:{onClick:()=>window.location.reload()}
                    }
                  ]
                },
                {html:getSvg(chanceResult === 'winner'?9:10),align:'h'},
                {
                  size:48,
                  html:chanceResult === 'winner'?'شما برنده شدید':'متاسفانه برنده نشدید',
                  align:'vh',
                  style:{color:chanceResult === 'winner'?'#107C10':'#A4262C',fontSize:24,fontWeight:'bold'}
                },
                {
                  align:'h',size:96,
                  html:'فردا دوباره شانس خود را امتحان کنید'
                },
                {
                  show:chanceResult === 'winner',
                  html:<AwardCard {...awards[chanceIndex]} icon={getSvg(awards[chanceIndex].icon)}/> 
                },
                {
                  html:<button>بازگشت به خانه</button>
                },
                {
                  show:chanceResult === 'winner',
                  html:<button>خرید</button>
                },
                {
                  show:chanceResult === 'winner',size:48,align:'vh',style:{fontSize:14},
                  html:'جایزه شما به مدت 30 روز در بروکس من قابل دریافت است'
                },
                {size:24}
              ]
            }}
          />
        </div>        
      }
      {
        showUserAwards &&
        <UserAwards items={userAwards} onClose={()=>this.setState({showUserAwards:false})}/>
      }
      </>
    )
  }
}

class AwardsPreview extends Component{
  state = {activeIndex:0}
  changeAward(dir) {
    let { activeIndex } = this.state;
    let { awards } = this.props;
    activeIndex = activeIndex + dir;
    if(activeIndex < 0){activeIndex = awards.length - 1}
    if(activeIndex > awards.length - 1){activeIndex = 0}
    this.setState({activeIndex})
  }
  render(){
    let {activeIndex} = this.state;
    let {awards,onClick = ()=>{}} = this.props;
    let visibleAward = awards[activeIndex];
    return (
      <RVD
        layout={{
          style: { padding: '0 12px' },
          row: [
            {
              size: 30, html: <Icon path={mdiChevronRight} />,
              attrs: { onClick: () => this.changeAward(-1) }
            },
            {
              flex: 1,
              attrs:{onClick:()=>onClick(activeIndex)},
              html: (
                <AwardCard
                  title={visibleAward.title}
                  subtitle={visibleAward.subtitle}
                  icon={getSvg(visibleAward.icon)}
                />
              )
            },
            {
              size: 30, html: <Icon path={mdiChevronLeft} />,
              attrs: { onClick: () => this.changeAward(1) }
            },
          ]
        }}
      />
    )
  }
}
class AwardCard extends Component {
  render() {
    let { icon, title, subtitle } = this.props;
    return (
      <RVD
        layout={{
          className: 'award-card' ,
          gap: 16,
          row: [
            { html: icon, align: 'vh' },
            {
              style: { padding: '8px 0' },
              column: [
                { show: !!title, html: () => title, flex: 1,style: { fontSize: 16 } } ,
                { show: !!subtitle, html: subtitle, flex: 1, align: 'v',style: { fontSize: 14, fontWeight: 'bold' } },

              ]
            }
          ]
        }}
      />
    )
  }
}
class UserAwards extends Component{
  render(){
    let {items,onClose} = this.props;
    let usedItems = [];
    let unusedItems = [];
    for(let i = 0; i < items.length; i++){
      let {used} = items[i];
      if(used){
        usedItems.push(items[i])
      }
      else {
        unusedItems.push(items[i])
      }
    }
    return (
      <RVD
        layout={{
          className:'user-rewards',style:{direction:'rtl'},
          column:[
            {
              size:60,style:{borderBottom:'1px solid #ccc'},
              row:[
                {size:60,html:<Icon path={mdiChevronRight} size={1}/>,align:'vh',attrs:{onClick:()=>onClose()}},
                {html:'جایزه ها',align:'v',style:{fontSize:20}}
              ]
            },
            {size:40,align:'vh',html:'مهلت استفاده از جایزه برنده شده 30 روز می باشد'},
            {
              style:{padding:'0 24px'},size:36,align:'v',
              gap:12,
              row:[
                {html:'مرتب سازی بر اساس : '},
                {flex:1,html:(
                  <AIOButton
                    style={{fontFamily:'inherit',width:'100%',border:'1px solid #ddd',height:24}} 
                    rtl={true}
                    popupWidth='fit'
                    type='select'
                    value='2'
                    options={[
                      {text:'ارزش',value:'1'},
                      {text:'زمان باقیمانده',value:'2'},
                      
                    ]}
                  />
                )}

              ]
            },
            {
              flex:1,scroll:'v',
              column:unusedItems.concat(usedItems).map(({title = '',subtitle = '',used,date,code,remaining})=>{
                
                return {
                    size:93,
                    className:'user-reward-item' + (used?' used':''),
                    row:[
                      {
                        flex:1,
                        style:{padding:12},
                        column:[
                          {
                            flex:1,align:'v',
                            row:[
                              {html:title + ' ' + subtitle,align:'v'},
                              {flex:1},
                              {html:date,style:{fontSize:12},align:'v'}
                            ]
                          },
                          {size:18},
                          {
                            flex:1,align:'v',
                            row:[
                              {html:code,align:'v',style:{fontSize:12}},
                              {flex:1},
                              {show:remaining !== undefined,html:'انقضا' + ' ' + remaining + ' ' + 'روز',align:'v',style:{fontSize:12,color:remaining < 7?'red':undefined}}
                            ]
                          }
                        ]
                      },
                      {
                        size:68,align:'vh',
                        className:'user-reward-item-label',
                        html:!used?'استفاده':'استفاده نشده'
                      },
                    ]
                }
              })
            }
          ]
        }}
      />
      
    )
  }
}


