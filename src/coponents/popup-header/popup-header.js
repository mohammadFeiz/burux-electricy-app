import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import getSvg from '../../utils/getSvg';
export default class PopupHeader extends Component{
    render(){
        let {onClose,title} = this.props;
        return (
            <RVD
                layout={{
                    style:{height:60,overflow:'visible'},
                    className:'box-shadow bgFFF',
                    row:[
                        {size:60,html:getSvg("chevronLeft", { flip: true }),align:'vh',attrs:{onClick:()=>onClose()}},
                        {html: title,className: "size16 color605E5C bold",align:'v'}
                    ]
                }}
            />
        )
    }
}