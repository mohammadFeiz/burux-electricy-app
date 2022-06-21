import getSvg from "./utils/getSvg";
import functions from "./functions";
import AIOButton from "./coponents/aio-button/aio-button";
export default function layout(type,getState, parameters = {}) {
    let $$ = {
        search() {
            let { onClick=()=>{},onChange,value = '' } = parameters;
            return {
                size: 48,
                row: [
                    { size: 60, html: getSvg(26), align: 'vh' },
                    {
                        flex: 1, html: (
                            <input
                                type='text' className='search-box' value={value}
                                placeholder='کالای مد نظر خود را جستجو کنید'
                                onChange={onChange?(e)=>onChange(e.target.value):()=>{}}
                                onClick={(e) => onClick()}
                            />
                        )
                    },
                    { size: 16 }
                ]
            }
        },
        tabs() {
            let { tabs, activeTabId, onClick} = parameters;
            return {
                gap: 12, className: 'tabs', row: tabs.map((o) => {
                    let badge = typeof o.badge === 'function'?o.badge():o.badge;
                    return {
                        align: 'vh', size: o.size, flex: o.flex, className: 'tab' + (o.id === activeTabId ? ' active' : undefined),
                        attrs: { onClick: () => onClick(o) },
                        row: [
                            { html: o.title, className: 'tab-title', align: 'v' },
                            { show: badge !== undefined, html: badge, className: 'tab-badge' + (o.length !== 0 ? ' active' : ''), align: 'vh' }
                        ]
                    }
                })
            }
        },
        checkButton() {
            let {text,active,onClick,color,background} = parameters;
            return <AIOButton
                onClick={()=>onClick()}
                className={'check-button' + (active ? ' active' : '')}
                type='button'
                style={{background,color,borderColor:color}}
                before={<><div className='check-button-checkbox' style={{background:color,color:background}}></div><div style={{ width: 8 }}></div></>}
                text={text}
            />
        },
        getProductSrc(product){
            let {srcs = [],defaultVariant = {}} = product
            return (srcs.length === 0?defaultVariant.srces || []:srcs)[0];
        },
        getProductCardParameters(){
            let {product,style,onClick} = parameters;
            if(product){
                let {name,inStock,defaultVariant = {},campaign} = product;
                let {discountPrice,discountPercent,price} = defaultVariant;
                return {src:$$.getProductSrc(product),discountPrice,discountPercent,price,name,inStock,style,onClick,campaign}
            }
            return parameters;
            
        },
        isInBasket(){
            let {product} = parameters;
            if(!product){return false}
            let {cart} = getState();
            for(let i = 0; i < product.variants.length; i++){
                if(cart[product.variants[i].id]){return true}
            }
            return false
        },
        productCard(){
            let {name,style = {},inStock,onClick = ()=>{},src,discountPrice,discountPercent,price} = $$.getProductCardParameters();
            return {
                size:168,style:{background:'#fff',borderRadius:12,fontSize:14,border:'1px solid #ddd',...style},
                attrs:{onClick:()=>onClick()},
                column:[
                    {html:<img src={src} alt='' height='100%'/>,align:'vh',size:136},
                    {html:name,className:'color323130 bold padding-12',style:{whiteSpace:'normal'}},
                    {flex:1},
                    {
                        show:!!discountPercent && inStock !== 0,
                        row:[
                            {flex:1},
                            {html:functions.splitPrice(discountPrice),className:'colorA19F9D'},
                            {size:6},
                            {html:'%' + discountPercent,style:{background:'#FDB913',color:'#fff',borderRadius:8,padding:'0 3px'}},
                            {size:12}
                            
                        ]
                    },
                    {
                        show:!!price && inStock !== 0,
                        row:[
                            {flex:1},
                            {html:functions.splitPrice(price),className:'color323130 bold'},
                            {size:6},
                            {html:'ریال',className:'color323130 bold'},
                            {size:12}
                        ]
                    },
                    {
                        show:inStock === 0,
                        row:[
                            {flex:1},
                            {html:'نا موجود',className:'colorD83B01 bold size12'},
                            {size:12}
                        ]
                    },
                    {size:12},
                    
                    
                ]
            }
        },
        
        productCard2(){
            let {name,style = {},inStock,onClick = ()=>{},src,discountPrice,discountPercent,price,isFirst,isLast,count,changeCount,details = [],isInBasket = false,campaign} = $$.getProductCardParameters();
            return {
                className:'box gap-no-color',
                attrs:{onClick:()=>onClick()},
                style:{
                    padding:6,
                    borderBottomLeftRadius:!isLast?0:undefined,
                    borderBottomRightRadius:!isLast?0:undefined,
                    borderTopLeftRadius:!isFirst?0:undefined,
                    borderTopRightRadius:!isFirst?0:undefined
                },
                gap:12,
                row:[
                    {
                        size:96,
                        column:[
                            {flex:1,html:<img src={src} width={'100%'} alt=''/>},
                            {
                                size:24,childsProps: { align: "vh" },
                                row: [
                                    {html:()=> (<div onClick={()=>changeCount(count + 1)} className='product-count-button'>+</div>),show:changeCount !== undefined},
                                    { flex:1, html: count,show:count !== undefined,align:'vh' },
                                    {html: ()=>(<div onClick={() =>changeCount(count - 1)} className='product-count-button'>-</div>),show:changeCount !== undefined},
                                ]
                            }
                        ]
                    },
                    {
                        flex:1,gap:6,
                        column:[
                            {show:campaign !== undefined,html:()=>campaign.name,className:'size10',style:{color:'rgb(253, 185, 19)'}},
                            {html:name,className:'size14 color575756 bold'},
                            {
                                childsAttrs:{align:'v'},gap:4,show:!!discountPercent && inStock !== 0,
                                row:[
                                    {flex:1},
                                    {html:functions.splitPrice(discountPrice),className:'size14 colorA19F9D'},
                                    {html:<div style={{background:'#FFD335',color:'#fff',padding:'1px 3px',fontSize:12,borderRadius:6}}>{discountPercent + '%'}</div>},
                                ],
                                
                            },
                            {
                                show:details.length !== 0,
                                column:details.map((d)=>{
                                    return {
                                        size:20,gap:6,
                                        childsProps:{align:'v'},
                                        row:[
                                            {html:d[0],className:'size10 colorA19F9D'},
                                            {html:':',className:'size10 colorA19F9D'},
                                            {html:d[1],className:'size10 colorA19F9D'}
                                        ]
                                    }
                                })
                            },
                            {flex:1},
                            {
                                show:inStock === 0,
                                row:[
                                    {flex:1},
                                    {html:'نا موجود',className:'colorD83B01 bold size12'},
                                    {size:12}
                                ]
                            },
                            {
                                childsAttrs:{align:'v'},show:!!price && inStock !== 0,
                                row:[
                                    {flex:1,html:$$.isInBasket()?'موجود در سبد خرید شما':'',className:'colorD83B01 bold size10'},
                                    {html:functions.splitPrice(price) + ' ریال',className:'size12 color404040 bold'}
                                ],
                                
                            }
                        ]
                    }
                ]
            }
        }
    };
    if(!(typeof parameters === 'object'?parameters.show !== false:true)){return {html:''}}
    return $$[type]()
}