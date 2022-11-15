import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import getSvg from '../../utils/getSvg';
import $ from 'jquery';
import './index.css';
export default class ProductCount extends Component{
    constructor(props){
        super(props);
        let {value} = this.props;
        this.state = {value,prevValue:value}
    }
    change(value,min){
        let {onChange,max = Infinity} = this.props;
        if(value < min || value > max){return}
        this.setState({value});
        clearTimeout(this.changeTimeout);
        this.changeTimeout = setTimeout(()=>{
            onChange(value)
        },600)
        
    }
    touchStart(dir){
        let {value} = this.state;
        this.change(value + dir)
        $(window).bind('touchend',$.proxy(this.touchEnd,this))
        $(window).bind('mouseup',$.proxy(this.touchEnd,this))
        clearTimeout(this.timeout);
        clearInterval(this.interval);
        this.timeout = setTimeout(()=>{
          this.interval = setInterval(()=>{
            let {value} = this.state;
            let {min = 0} = this.props;
            this.change(value + dir,Math.max(min,1))
          },100)
        },500)
      }
      touchEnd(){
        $(window).unbind('touchend',this.touchEnd)
        clearTimeout(this.timeout)
        clearInterval(this.interval) 
      }
    render(){
        let {value,prevValue} = this.state;
        let {min = 0,onChange,max = Infinity} = this.props;
        if(this.props.value !== prevValue){setTimeout(()=>this.setState({value:this.props.value,prevValue:this.props.value}),0)}
        return (
            <RVD
                layout={{
                    childsProps: { align: "vh" },
                    style:{height:36},
                    attrs:{onClick:(e)=>e.stopPropagation()},
                    row: [
                        {html: (<div onMouseDown={(e)=>this.touchStart(1)} onTouchStart={(e)=>this.touchStart(1)} className={'product-count-button' + (value >= max?' disabled':'')}>+</div>),show:onChange!== undefined},
                        { flex: 1, html: value },
                        {html: ()=>(<div onMouseDown={(e) =>this.touchStart(-1)} onTouchStart={(e) =>this.touchStart(-1)} className='product-count-button'>-</div>),show:value > 1 && onChange!== undefined},
                        {
                            html: ()=>(
                                <div 
                                    onClick={(e)=>this.change(this.props.value - 1,min)} 
                                    className='product-count-button'
                                >
                                    -
                                </div>
                            ),
                            show:value === 1 && onChange!== undefined
                        },
                    ] 
                }}
            />
        )
    }
}