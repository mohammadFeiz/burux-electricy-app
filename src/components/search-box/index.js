import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import getSvg from '../../utils/getSvg';
import './index.css';
export default class SearchBox extends Component{
    constructor(props){
        super(props);
        this.state = {value:props.value || ''}
    }
    change(e){
        let {onChange} = this.props;
        if(!onChange){return}
        this.setState({value:e.target.value});
        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>{
            onChange(e.target.value)
        },800)
    }
    render(){
        let { onClick=()=>{},onChange} = this.props; 
        let {value} = this.state;
        return (
            <RVD
                layout={{
                    className:'search-box bgFFF',
                    row: [
                        { size: 60, html: getSvg(26), align: 'vh' },
                        {
                            flex: 1, html: (
                                <input
                                    type='text' value={value} 
                                    className='theme-1-colorFFF'
                                    placeholder='کالای مد نظر خود را جستجو کنید'
                                    onChange={(e)=>this.change(e)}
                                    onClick={(e) => onClick()}
                                />
                            )
                        },
                        { size: 16 }
                    ]
                }}
            />
        )
    }
}