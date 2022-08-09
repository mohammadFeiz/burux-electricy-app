import React,{Component} from 'react';
import './index.css';
export default class SliderDots extends Component {
    render() {
        let { length,index } = this.props;
        return (
            <div className='slider-dots'>
                <div style={{flex:1}}></div>
                {new Array(length).fill(0).map((o,i) => <div className={'slider-dots-item' + (i === index?' active':'')}></div>)}
                <div style={{flex:1}}></div>
            </div>
        )
    }
}