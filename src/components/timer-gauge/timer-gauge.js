import React,{Component} from 'react';
import Gauge from 'r-gauger';
export default class TimerGauge extends Component{
    render(){
        let {totalTime,remainingTime} = this.props;
        let timeRate = remainingTime / totalTime;
        let timeColor;
        if(timeRate < 0.33){timeColor = 'red'}
        else if(timeRate < 0.66){timeColor = 'orange'}
        else {timeColor = 'green'}
        return (
            <Gauge
                style={{width:100,height:120}} rotate={180} direction='clockwise'
                label={{step:5,style:{offset:46,color:'#d5d5d5'}}}
                start={0} radius={32} angle={360} end={totalTime} thickness={4}
                text={[
                    {value:remainingTime.toFixed(0),style:{top:-10,fontSize:16,color:timeColor}},
                    {value:'دقیقه',style:{top:10,fontSize:14,color:'#A19F9D',fontFamily:'IranSans_light'}}
                ]}
                ranges={[
                    {value:remainingTime,color:timeColor},
                    {value:totalTime,color:'#ddd'}
                ]}
            />
        )
    }
}