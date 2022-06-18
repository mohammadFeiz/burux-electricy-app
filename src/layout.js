import getSvg from "./utils/getSvg";
import AIOButton from "./coponents/aio-button/aio-button";
export default function layout(type, parameters) {
    let $$ = {
        splitPrice(price){
            if(!price){return price}
            let str = price.toString()
            let dotIndex = str.indexOf('.');
            if(dotIndex !== -1){
                str = str.slice(0,dotIndex)
            }
            let res = ''
            let index = 0;
            for(let i = str.length - 1; i >= 0; i--){
                res = str[i] + res;
                if(index === 2){
                    index = 0;
                    if(i > 0){res = ',' + res;}
                }
                else{index++}
            }
            return res
        },
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
            let { tabs, activeTabId, onClick,show = true } = parameters;
            if(!show){return {html:''}}
            return {
                gap: 12, className: 'tabs', row: tabs.map((o) => {
                    return {
                        align: 'vh', size: o.size, flex: o.flex, className: 'tab' + (o.id === activeTabId ? ' active' : undefined),
                        attrs: { onClick: () => onClick(o) },
                        row: [
                            { html: o.title, className: 'tab-title', align: 'v' },
                            { show: o.badge !== undefined, html: o.badge, className: 'tab-badge' + (o.length !== 0 ? ' active' : ''), align: 'vh' }
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
        productCard(){
            let {src,name,discountPrice,discountPercent,price,style = {},inStock,onClick = ()=>{}} = parameters;
            return {
                size:168,style:{background:'#fff',borderRadius:12,fontSize:14,...style},
                attrs:{onClick:()=>onClick()},
                column:[
                    {html:<img src={src} alt='' height='100%'/>,align:'vh',size:136},
                    {html:name,className:'color323130 bold padding-12',style:{whiteSpace:'normal'}},
                    {flex:1},
                    {
                        show:!!discountPercent,
                        row:[
                            {flex:1},
                            {html:$$.splitPrice(discountPrice),className:'colorA19F9D'},
                            {size:6},
                            {html:'%' + discountPercent,style:{background:'#FDB913',color:'#fff',borderRadius:8,padding:'0 3px'}},
                            {size:12}
                            
                        ]
                    },
                    {
                        show:!!price && inStock,
                        row:[
                            {flex:1},
                            {html:$$.splitPrice(price),className:'color323130 bold'},
                            {size:6},
                            {html:'تومان',className:'color323130 bold'},
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
                    // {
                    //     show:typeof stockType === 'string',
                    //     row:[
                    //         {flex:1},
                    //         {html:'در این طرح موجود نیست',className:'colorD83B01 size10'},
                    //         {size:12}
                    //     ]
                    // },
                    // {
                    //     show:price!== undefined && typeof stockType === 'string',
                    //     row:[
                    //         {flex:1},
                    //         {html:'در طرح ',className:'color323130 size10',align:'v'},
                    //         {html:stockType,className:'color323130 size10',align:'v'},
                    //         {size:6},
                    //         {html:$$.splitPrice(price),className:'color323130 bold',align:'v'},
                    //         {size:6},
                    //         {html:'تومان',className:'color323130 bold',align:'v'},
                    //         {size:12}
                    //     ]
                    // },
                    {size:12},
                    
                    
                ]
            }
        },
        
        productCard2(){
            let {isLast,isFirst,src,name,discountPercent,discountPrice,Qty,price,inStock} = parameters;
            return {
                className:'box gap-no-color',
                style:{
                    padding:6,
                    borderBottomLeftRadius:!isLast?0:undefined,
                    borderBottomRightRadius:!isLast?0:undefined,
                    borderTopLeftRadius:!isFirst?0:undefined,
                    borderTopRightRadius:!isFirst?0:undefined
                },
                row:[
                    {
                        size:96,
                        column:[
                            {flex:1,html:<img src={src} width={'100%'} alt=''/>},
                            {size:24,}
                        ]
                    },
                    {
                        flex:1,gap:6,
                        column:[
                            {html:name,className:'size14 color575756 bold'},
                            {
                                childsAttrs:{align:'v'},gap:4,show:!!discountPrice,
                                row:[
                                    {flex:1},
                                    {html:$$.splitPrice(discountPrice),className:'size14 colorA19F9D'},
                                    {html:<div style={{background:'#FFD335',color:'#fff',padding:'1px 3px',fontSize:12,borderRadius:6}}>{discountPercent + '%'}</div>},
                                ],
                                
                            },
                            {
                                show:!!!inStock,
                                row:[
                                    {flex:1},
                                    {html:'نا موجود',className:'colorD83B01 bold size12'},
                                    {size:12}
                                ]
                            },
                            {
                                childsAttrs:{align:'v'},show:!!inStock,
                                row:[
                                    {flex:1},
                                    {html:$$.splitPrice(price) + ' تومان',className:'size12 color404040 bold'}
                                ],
                                
                            },
                            // {
                            //     show:typeof stockType === 'string',
                            //     row:[
                            //         {flex:1},
                            //         {html:'در این طرح موجود نیست',className:'colorD83B01 size10'},
                            //         {size:12}
                            //     ]
                            // },
                            // {
                            //     childsAttrs:{align:'v'},show:typeof stockType === 'string',
                            //     row:[
                            //         {flex:1},
                            //         {html:'در طرح ',className:'size10 color404040'},
                            //         {html:stockType,className:'size10 color404040'},
                            //         {size:6},
                            //         {html:$$.splitPrice(price) + ' تومان',className:'size12 color404040 bold'}
                            //     ],
                                
                            // }
                        ]
                    }
                ]
            }
        }
    };
    return $$[type]()
}