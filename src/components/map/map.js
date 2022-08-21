import React,{Component} from "react";
export default class Map extends Component{
    getOptions(){
        let {changeView = true,zoom = 12,latitude,longitude,key} = this.props;
        let options = {
            key: key || 'web.3b7ae71ad0f4482e84b0f8c47e762b5b',
            center: [latitude, longitude],
            maptype:'standard-day',
            dragging:changeView !== false,
            zoomControl:changeView !== false,
            zoom
        }
        if(changeView === false){
            options.minZoom = zoom;
            options.maxZoom = zoom;
        }
        return options
    }
    render(){
        let {onClick,points,onSubmit,multiple} = this.props;
        let {latitude,longitude} = this.state;
        return (
            <NeshanMap
                options={this.getOptions()} 
                onInit={(L, myMap) => {
                    if(points){
                        for(let i = 0; i < points.length; i++){
                            let {latitude,longitude,text} = points[i];
                            let marker = L.marker([latitude, longitude]).addTo(myMap).bindPopup(text);
                        }
                    }
                    if(onClick){myMap.on('click', (e)=> onClick());}
                    if(onSubmit){
                        if(!multiple){
                            let marker = L.marker([latitude, longitude])
                            .addTo(myMap)
                            .bindPopup('I am a popup.');

                            myMap.on('move', function (e) {
                                //marker.setLatLng(e.target.getCenter())
                                let {lat,lng} = e.target.getCenter()
                                marker.setLatLng({lat,lng})
                                setCoords({latitude:lat,longitude:lng})
                            });
                        }
                    }

                    // L.circle([35.699739, 51.338097], {
                    // color: 'dodgerblue',
                    // fillColor: 'dodgerblue',
                    // fillOpacity: 0.5,
                    // radius: 1500
                    // }).addTo(myMap);
                }}
                style={{
                    width:'100%',
                    height:'120px'
                }}
            />
        )
    }
}
