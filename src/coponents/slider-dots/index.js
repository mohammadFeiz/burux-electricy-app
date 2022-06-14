import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import './index.css';
export default class SliderDots extends Component {
    render() {
        let { length,index } = this.props;
        return (
            <RVD
                layout={{
                    className: 'slider-dots',
                    row: [
                        { flex: 1 },
                        {
                            gap: 4, row: new Array(length).fill('a').map((o,i) => {
                                return { 
                                    html: <div className={'slider-dots-item' + (i === index?' active':'')}></div>, 
                                    align: 'vh' 
                                }
                            })
                        },
                        { flex: 1 }
                    ]
                }}
            />
        )
    }
}