import React, { Component,Fragment } from 'react';
import AIOButton from './../../components/aio-button/aio-button';
import ProductCount from './../../components/product-count/index';
import Header from './../../components/header/header';
import RVD from 'react-virtual-dom';
import appContext from './../../app-context';
import getSvg from './../../utils/getSvg';
import { mdiChevronLeft } from '@mdi/js';
import {Icon} from '@mdi/react';
import functions from '../../functions';
export default class Product extends Component {
    static contextType = appContext;
    componentDidMount(){
        this.mounted = true;
        this.getVariants()
        let { product } = this.context;
        let firstVariant = product.inStock ? (product.variants.filter((o) => o.inStock === null ? false : !!o.inStock)[0]) : undefined;
        this.setState({
            optionValues: firstVariant ? { ...firstVariant.optionValues } : undefined, showDetails: true,
            selectedVariant: firstVariant, srcIndex: 0
        });
    }
    getVariants() {
        let { product } = this.context;
        let { variants, optionTypes } = product;
        let optionTypesDict = {}
        let optionValuesDict = {}
        for (let i = 0; i < optionTypes.length; i++) {
            let o = optionTypes[i];
            optionTypesDict[o.id] = o.name;
            for (let prop in o.items) {
                let id = prop.toString();
                let name = o.items[id];
                optionValuesDict[id] = name;
            }
        }
        let res = [];
        this.ovs = []
            
        for (let i = 0; i < variants.length; i++) {
            let { optionValues, inStock, id } = variants[i];
            if (!inStock || inStock === null) { continue }
            let str = [];
            for (let prop in optionValues) {
                str.push(optionTypesDict[prop] + ' : ' + optionValuesDict[optionValues[prop]])
                this.ovs.push(optionValuesDict[optionValues[prop]]);
            }
            str = str.join(' -- ')
            res.push({ text: str, value: id, variant: variants[i],style:{height:36} })
        }
        this.options = res;
    }
    getVariantBySelected(selected) {
        let { product } = this.context;
        for (let i = 0; i < product.variants.length; i++) {
            let variant = product.variants[i];
            let { optionValues } = variant;
            let isMatch = true;
            for (let prop in selected) {
                if (selected[prop] !== optionValues[prop]) {
                    isMatch = false;
                    break;
                }
            }
            if (isMatch) {
                return variant;
            }
        }
        return false;
    }
    changeOptionType(obj) {
        let { optionValues } = this.state;
        let key = Object.keys(obj)[0]
        let newSelected;
        if(obj[key] === optionValues[key]){
            newSelected = {...optionValues,[key]:undefined};
        }
        else{
            newSelected = { ...optionValues, ...obj };
        }
        let variant = this.getVariantBySelected(newSelected);
        this.setState({
            optionValues: newSelected,
            selectedVariant: variant
        });
    }
    getInStock() {
        let { selectedVariant } = this.state;
        let { inStock = 0 } = selectedVariant;
        if (inStock === null) { inStock = 0 }
        return inStock;
    }
    changeCount(count) {
        let { changeCart } = this.context;
        let { selectedVariant } = this.state;
        let variantId = selectedVariant.id;
        changeCart(count, variantId);
    }
    header_layout(){
        let {SetState,productZIndex} = this.context;
        return {
            html:(
                <Header 
                    zIndex={productZIndex} 
                    onClose={()=>SetState({product:false,productZIndex:0})} 
                    title='خرید کالا'
                    buttons={{cart:true}}
                />
            ),
            style:{overflow:'visible'}}
    }
    body_layout() {
        let { product } = this.context;
        let { name, ItemCode, optionTypes, details, srcs } = product;
        let { srcIndex } = this.state;
        return {
            flex: 1,
            scroll: "v",
            gap: 12,
            column: [
                this.image_layout(name, ItemCode, srcs[srcIndex]),
                this.options_layout(),
                this.optionTypes_layout(optionTypes),
                this.details_layout(details),
                
            ],
        };
    }
    image_layout(name, ItemCode, src) {
        let { product } = this.context, { srcIndex } = this.state;
        return {
            size: 346, className: "box margin-0-12",
            column: [
                { size: 24 },
                {
                    flex: 1, style: { overflow: 'hidden' },
                    childsProps: { align: "vh" },
                    row: [
                        { size: 36, html: getSvg("chevronLeft", { flip: true }), style: { opacity: srcIndex === 0 ? 0.5 : 1 } },
                        { flex: 1, html: <img src={src} alt="" height="100%" /> },
                        { size: 36, html: getSvg("chevronLeft"), style: { opacity: srcIndex === product ? 0.5 : 1 } },
                    ],
                },
                { size: 12 },
                { size: 36, html: name, className: "size16 color323130 bold padding-0-12" },
                { size: 36, html: "کد کالا : " + (ItemCode || ""), className: "size14 color605E5C padding-0-12" },
                { size: 12 },
            ],
        };
    }
    options_layout() {
        let { product } = this.context;
        if (product.optionTypes.length < 2) { return false }
        return {
            className: 'box margin-0-12',
            column: [
                {
                    align: 'v', className: 'padding-12',
                    html: (
                        <AIOButton
                            type='select' className='product-exist-options main-bg'
                            style={{width:'100%'}}
                            popupAttrs={{ style: { maxHeight: 400 } }}
                            options={this.options}
                            popupWidth='fit'
                            text='انتخاب اقلام موجود'
                            optionStyle='{height:28,fontSize:12}'
                            onChange={(value, obj) => {
                                this.changeOptionType(obj.option.variant.optionValues)
                            }}
                        />
                    )
                }
            ]

        }
    }
    optionTypes_layout(optionTypes) {
        let { optionValues, selectedVariant } = this.state;
        if (!optionValues || !optionTypes) { return { html: '' } }
        return {
            className: "box gap-no-color margin-0-12",
            column: [
                {
                    column: optionTypes.map(({ name, id, items = {} }, i) => {
                        if(name === 'brand'){return false}
                        return {
                            column: [
                                { size: 12 },
                                { size: 36, html: name, align: "v", className: "size14 color605E5C padding-0-12" },
                                { size: 6 },
                                {
                                    className: "padding-0-12", scroll: 'h', gap: 12,
                                    row: Object.keys(items).filter((o)=>{
                                        return this.ovs.indexOf(items[o]) !== -1
                                    }).map((o) => {
                                        let itemId = o.toString();
                                        let active = false,style;
                                        if(optionValues[id] === undefined){
                                            console.error(`
in product by id = ${this.context.product.id} there is an optionType by id = ${id}. but in optionValues we can find this id. optionValues is ${JSON.stringify(optionValues)}
                                            `)
                                        }
                                        else{
                                            active = optionValues[id].toString() === itemId;
                                        }
                                        let className = 'size14 padding-3-12 product-option-value';
                                        if (active) { className += ' active'; }
                                        return { html: items[itemId], align: "vh", className, style, attrs: { onClick: () => this.changeOptionType({ [id]: itemId }), } };
                                    }),
                                },
                            ],
                        };
                    }),
                },
                { size: 12 },
            ],
        };
    }
    details_layout(details) {
        let { showDetails } = this.state;
        return {
            className: "box margin-0-12",
            style: { padding: 12 },
            column: [
                {
                    size: 36, childsProps: { align: 'v' },
                    attrs: { onClick: (() => this.setState({ showDetails: !showDetails })) },
                    row: [
                        { size: 24, align: 'vh', html: getSvg('chevronLeft', { width: 12, height: 12, rotate: showDetails ? -90 : 0 }) },
                        { html: 'مشخصات', className: "size14 color605E5C" }
                    ]
                },
                {
                    show: !!showDetails,
                    html: () => (
                        <div style={{ display: "grid", gridTemplateColumns: "auto auto", gridGap: 1, width: "100%", background: "#DADADA" }}>
                            {details.map((o, i) => {
                                let props = { className: "size12 color605E5C padding-6-12", style: { background: "#F4F4F4" } };
                                return (<Fragment key={i}><div {...props}>{o[0]}</div><div {...props}>{o[1]}</div></Fragment>);
                            })}
                        </div>
                    )
                }
            ]
        };
    }
    showCart_layout(){
        let { SetState,productZIndex,cart } = this.context;
        if(!Object.keys(cart).length){return false}
        return {
            className:'padding-0-12 bgFFF',size:36,align:'v',
            row:[
                {html:'مشاهده',className:'colorA19F9D size12 bold',align:'v'},
                {size:4},
                {html:'سبد خرید',className:'color0094D4 size12 bold',align:'v',attrs:{
                    onClick:()=>{
                        SetState({cartZIndex:productZIndex * 10})
                    }
                }},
                {size:4},
                {html:<Icon path={mdiChevronLeft} size={0.8} color={'#0094D4'}/>,align:'vh'}
            ]
        }
    }
    footer_layout() {
        return {
            size: 80, style: { background: "#fff",boxShadow:'0 0px 6px 1px rgba(0,0,0,.1)' }, className: "padding-0-24",
            row: [
                this.addToCart_layout(), 
                { flex: 1 }, 
                this.price_layout()
            ],
        };
    }
    addToCart_layout() {
        let { getCartCountByVariantId,SetState,productZIndex } = this.context;
        let { selectedVariant } = this.state;
        if (!selectedVariant || !selectedVariant.inStock || selectedVariant.inStock === null) {
            return { html: '' }
        }
        let count = getCartCountByVariantId(selectedVariant.id)
        return {
            column:[
                {
                    flex:1,show:!!!count,html: (<button onClick={() => this.changeCount(1)} className={"button-2" + (!selectedVariant ? " disabled" : "")}>افزودن به سبد خرید</button>),
                    align: "v",
                },
                { flex:1,align:'v',show:!!count, html: () => <ProductCount value={count} onChange={(count) => this.changeCount(count)} max={this.getInStock()} />,style:{width:90} },
                
            ]
        }
    }
    price_layout() {
        let { selectedVariant } = this.state;
        if (!selectedVariant || !selectedVariant.inStock || selectedVariant.inStock === null) {
            return { column: [{ flex: 1 }, { html: "ناموجود", className: "colorD83B01 bold size14" }, { flex: 1 }] };
        }
        return {
            column: [
                { flex: 1 },
                {
                    row: [
                        { flex: 1 },
                        { html: <del>{functions.splitPrice(selectedVariant.Price)}</del>, className: "colorA19F9D" },
                        { size: 6 },
                        {
                            html: "%" + selectedVariant.CmpgnDscnt,show:!!selectedVariant.CmpgnDscnt,
                            style: { background: "#FDB913", color: "#fff", borderRadius: 8, padding: "0 3px" },
                        },
                        { size: 6 },
                        {
                            html: "%" + selectedVariant.PymntDscnt,show:!!selectedVariant.PymntDscnt,
                            style: { background: "#ff4335", color: "#fff", borderRadius: 8, padding: "0 3px" },
                        },
                    ],
                },
                {
                    row: [
                        { flex: 1 },
                        { html: functions.splitPrice(selectedVariant.FinalPrice), className: "color323130 bold" },
                        { size: 6 },
                        { html: "ریال", className: "color323130 bold" },
                    ],
                },
                { flex: 1 },
            ],
        };
    }
    render() {
        if(!this.mounted){return null}
        let {productZIndex:zIndex} = this.context;
        return (
            <RVD
                layout={{
                    className: "main-bg fixed",
                    style:{zIndex},
                    column: [
                        this.header_layout(), 
                        this.body_layout(),
                        {size:12},
                        this.showCart_layout(), 
                        this.footer_layout()
                    ],
                }}
            />
        );
    }
}