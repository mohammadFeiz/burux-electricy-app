import React,{Component,createRef} from 'react';
import SliderDots from '../slider-dots';
import RVD from 'react-virtual-dom';
import $ from 'jquery';
import getSvg from '../../utils/getSvg';
//porps1 : items:array of objects
//each object:
// {
//     icon: 27,
//     background: '#662D91',
//     color: '#fff',
//     title: 'باز طراحی اپ الکتریکی',
//     subtitle: 'طراحی راحت تر وجدید با کلی قابلیت جدید!'
// }
//props2 : onClick:(index)=>{}
export default class ContentSlider extends Component {
    constructor(props) {
        super(props);
        this.dom = createRef();
        this.state = { index: 0 }
    }
    getItem(item) {
        let {style} = this.props;
        let {button = {}} = item;
        return (
            <RVD
                layout={{
                    className: 'content-slider-item',
                    style: { background: item.background, color: item.color,...style },
                    row: [
                        { size:96,html: item.icon, align: 'vh' },
                        { size: 12 },
                        {
                            flex: 1, column: [
                                {size:36},
                                { html: item.title,className: 'content-slider-title' },
                                {size:12},
                                { html: item.subtitle,className: 'content-slider-subtitle'},
                                { flex: 1 },
                                {
                                    show:button.text !== undefined,
                                    row:[
                                        {flex:1},
                                        {html:<button onClick={button.onClick}style={{background:item.color,color:item.background,border:'none',borderRadius:6,padding:'3px 12px'}}>{button.text}</button>},
                                        {size:36}
                                    ]
                                },
                                {size:24},
                                
                            ]
                        }
                    ]
                }}
            />
        )
    }
    fixScroll() {
        let left = this.dom.current.scrollLeft;
        this.isFixed = true;
        let newIndex = Math.round(left / window.innerWidth);
        let final = newIndex * window.innerWidth;
        $(this.dom.current).animate({ 'scrollLeft': final }, 400, () => { 
            let {onChange = ()=>{}} = this.props;
            let {index} = this.state;
            if(index === newIndex){return;}
            this.setState({ index: Math.abs(newIndex) }); 
            this.a = false;
            onChange(newIndex) 
        });
    }
    onScroll(e) {
        clearTimeout(this.timeout);
        if(this.a){return;}
        this.timeout = setTimeout(()=>{
            this.a = true;
            this.fixScroll();
        },30);
        
    }
    render() {
        let { items,onClick = ()=>{} } = this.props;
        let { index } = this.state;
        return (
            <RVD
                layout={{
                    className: 'content-slider-container',
                    column: [
                        {
                            scroll: 'h',
                            className: 'content-slider',
                            attrs: {
                                ref: this.dom,
                                onScroll: (e) => this.onScroll(e),
                                onClick:()=>onClick(index)
                            },
                            row: items.map((o) => {
                                return { html: this.getItem(o) }
                            })
                        },
                        {
                            show:items.length > 1,
                            html: <SliderDots length={items.length} index={index} />
                        }
                    ]
                }}
            />
        )
    }
}
