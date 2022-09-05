import React,{Component} from "react";
export default class Map extends Component{
    constructor(props){
        super(props);
        let {latitude,longitude} = props;
        this.state = {latitude,longitude}
    }
    setCoords({latitude,longitude}){
        clearTimeout(this.timeout);
        this.timeout = setTimeout(()=>{
            if(this.props.onChange){
                this.props.onChange(latitude,longitude)
            }
            this.setState({latitude,longitude})
        },500);   
    }
    render(){
        let {
            changeView,zoom = 12,onClick,style,
            key = 'web.3b7ae71ad0f4482e84b0f8c47e762b5b',
            onChange
        } = this.props;
        let {latitude,longitude} = this.state;
        return (
            <NeshanMap
                options={{
                    key,
                    center: [latitude, longitude],
                    maptype:'standard-day',
                    dragging:changeView !== false,
                    zoomControl:changeView !== false,
                    minZoom:changeView === false?zoom:undefined,
                    maxZoom:changeView === false?zoom:undefined,
                }}
                
                onInit={(L, myMap) => {
                    let marker = L.marker([latitude, longitude])
                    .addTo(myMap)
                    .bindPopup('I am a popup.');
                    if(onClick){
                        myMap.on('click', (e)=> onClick());
                    }
                    if(onChange){
                        myMap.on('move', (e) => {
                            //marker.setLatLng(e.target.getCenter())
                            let {lat,lng} = e.target.getCenter()
                            marker.setLatLng({lat,lng})
                            this.setCoords({latitude:lat,longitude:lng})
                        });
                    }

                    // L.circle([35.699739, 51.338097], {
                    // color: 'dodgerblue',
                    // fillColor: 'dodgerblue',
                    // fillOpacity: 0.5,
                    // radius: 1500
                    // }).addTo(myMap);
                }}
                style={style}
            />
        )
    }
}
