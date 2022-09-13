import React,{Component} from 'react';
import RVD from 'react-virtual-dom';
import ProductCount from '../product-count';
import NoSrc from './../../images/no-src.png';
import appContext from '../../app-context';
//props
//1 - product {name = '',variants = [{id}],price = 0,discountPrice = 0,discountPercent = 0,inStock = false,srcs = ['...']}
//3 - details = [[title = '',value = '']]
//4 - isFirst = false
//5 - isLast = false
//6 - count = 0
//7 - changeCount = undefined
//9 - type = 'horizontal' || 'vertical'
export default class ProductCard extends Component{
    static contextType = appContext;
    isInCart(){
        let {cart} = this.context;
        let {product} = this.props;
        try{
            for(let i = 0; i < product.variants.length; i++){
                if(cart[product.variants[i].id]){return true}
            }
            return false
        }
        catch{
            return false
        }
    
        
    }
    splitPrice(price){
        if(!price){return price}
        let str = price.toString(),dotIndex = str.indexOf('.');
        if(dotIndex !== -1){str = str.slice(0,dotIndex)}
        let res = '',index = 0;
        for(let i = str.length - 1; i >= 0; i--){
            res = str[i] + res;
            if(index === 2){index = 0; if(i > 0){res = ',' + res;}}
            else{index++}
        }
        return res
    }
    image_layout(){
        let {product} = this.props;
        let {srcs = []} = product;
        return {flex:1,align:'vh',html:<img src={srcs[0] || NoSrc} width={'100%'} alt=''/>}
    }
    count_layout(){
        let {count,changeCount,max} = this.props;
        if(count === undefined){return false}
        return {size:30,html:()=><ProductCount value={count} onChange={(count)=>changeCount(count)} max={max}/>}
    }
    title_layout(){
        let {product} = this.props;
        if(!product.campaign){return false}
        return {html:product.campaign.name,className:'size10',style:{color:'rgb(253, 185, 19)'}}
    }
    name_layout(){
        let {product} = this.props;
        let {name} = product;
        return {html:name,className:'size14 color575756 bold theme-1-colorDDD',style:{whiteSpace:'normal'}}
    }
    discount_layout(){
        let {product,count = 1} = this.props;
        let {inStock,Price,B1Dscnt = 0,CmpgnDscnt = 0,PymntDscnt = 0} = product;
        if(!Price || !inStock){return false}
        return {
            childsAttrs:{align:'v'},gap:4,className:'padding-0-12',
            row:[
                {flex:1},
                {html:<del>{this.splitPrice(Price * count)}</del>,className:'size14 colorA19F9D'},
                {
                    gap:3,
                    row:[
                        {show:!!B1Dscnt,html:<div style={{background:'#FFD335',color:'#fff',padding:'1px 3px',fontSize:12,borderRadius:6}}>{B1Dscnt + '%'}</div>},
                        {show:!!CmpgnDscnt,html:<div style={{background:'#ffa835',color:'#fff',padding:'1px 3px',fontSize:12,borderRadius:6}}>{CmpgnDscnt + '%'}</div>},
                        {show:!!PymntDscnt,html:<div style={{background:'#ff4335',color:'#fff',padding:'1px 3px',fontSize:12,borderRadius:6}}>{PymntDscnt + '%'}</div>}
                    ]
                },
            ]
        }
    }
    details_layout(){
        let {details = []} = this.props;
        if(!details.length){return false}
        return {
            column:details.map(([title,value])=>{
                return {size:20,html:`${title} : ${value}`,align:'v',className:'size10 colorA19F9D'}
            })
        }
    }
    notExist_layout(){
        let {product} = this.props;
        let {inStock} = product;
        if(inStock){return false}
        return {row:[{flex:1},{html:'نا موجود',className:'colorD83B01 bold size12'},{size:12}]}
    }
    isInCart_layout(){
        let {showIsInCart = true} = this.props;
        if(!this.isInCart() || !showIsInCart){return {flex:1}}
        return {flex:1,align:'v',html:'موجود در سبد خرید شما',className:'colorD83B01 bold size10 padding-0-12'}
    }
    price_layout(){
        let {product,count = 1} = this.props;
        let {FinalPrice,inStock} = product;
        if(!inStock || !FinalPrice){return false}
        return {row:[{flex:1},{html:this.splitPrice(FinalPrice * count) + ' ریال',className:'size12 color404040 bold theme-1-colorEEE padding-0-12'}]}
    }
    async onClick(){
        let {SetState,services} = this.context;
        let {product,parentZIndex = 1} = this.props;
        let parameter = {id:product.id,code:product.defaultVariant.code,product}
        product = await services({type:'getProductFullDetail',parameter})
        SetState({productZIndex:parentZIndex * 10,product})
    }
    horizontal_layout(){
        let {isLast,isFirst} = this.props;
        return (
            <RVD
                layout={{
                    className:'box gap-no-color margin-0-12',
                    attrs:{onClick:()=>this.onClick()},
                    style:{
                        padding:6,height:130,
                        borderBottomLeftRadius:!isLast?0:undefined,
                        borderBottomRightRadius:!isLast?0:undefined,
                        borderTopLeftRadius:!isFirst?0:undefined,
                        borderTopRightRadius:!isFirst?0:undefined
                    },
                    gap:12,
                    row:[
                        {
                            size:96,
                            column:[this.image_layout(),this.count_layout()]
                        },
                        {
                            flex:1,
                            column:[
                                {flex:1},
                                this.title_layout(),
                                this.name_layout(),
                                {flex:1},
                                this.discount_layout(),
                                this.details_layout(),
                                this.notExist_layout(),
                                {row:[this.isInCart_layout(),this.price_layout()]},
                                {flex:1}
                            ]
                        }
                    ]
                }}
            />
        )
    }
    vertical_layout(){
        let {style,product} = this.props;
        let {srcs = [],name} = product;
        return (
            <RVD
                layout={{
                    style:{height:270,width:180,borderRadius:12,fontSize:14,...style},
                    className:'bgFFF borderDDD theme-1-dark-bg theme-1-border3F4456',
                    attrs:{onClick:()=>this.onClick()},
                    column:[
                        {size:140,align:'vh',html:<img src={srcs[0] || NoSrc} width={'100%'} style={{width:'calc(100% - 24px)',height:'100%',borderRadius:8}} alt=''/>,style:{padding:6,paddingBottom:0}},
                        {html:name,className:'size12 padding-6-12 color575756 bold theme-1-colorDDD',style:{whiteSpace:'normal'}},
                        {flex:1},
                        this.isInCart_layout(),
                        this.discount_layout(),
                        this.price_layout(),
                        this.notExist_layout(),
                        {size:12}
                    ]
                }}
            />
        )
    }
    render(){
        let {type} = this.props;
        console.log(type)
        return this[type +'_layout']()
    }
}