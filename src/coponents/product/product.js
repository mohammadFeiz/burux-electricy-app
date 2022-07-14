import React, { Component } from 'react';
import AIOButton from './../aio-button/aio-button';
import ProductCount from '../product-count';
import PopupHeader from './../popup-header/popup-header';
import RVD from 'react-virtual-dom';
export default class Product extends Component {
    static contextType = appContext;
    constructor(props) {
        super(props);
        this.getVariants()
        let { product } = this.context;
        let firstVariant = product.inStock ? product.variants.filter((o) => o.inStock === null ? false : !!o.inStock)[0] : undefined;
        this.state = {
            optionValues: firstVariant ? { ...firstVariant.optionValues } : undefined, showDetails: true,
            selectedVariant: firstVariant, srcIndex: 0
        };
    }
    getVariants() {
        let { product } = this.context;
        let { variants, optionTypes } = product;
        let optionTypesDict = {}
        let optionValuesDict = {}
        for (let i = 0; i < optionTypes.length; i++) {
            let o = optionTypes[i];
            optionTypesDict[o.id] = o.name;
            for (let j = 0; j < o.items.length; j++) {
                let m = o.items[j];
                optionValuesDict[m.id] = m.name;
            }
        }
        let res = [];
        for (let i = 0; i < variants.length; i++) {
            let { optionValues, inStock, id } = variants[i];
            if (!inStock || inStock === null) { continue }
            let str = [];
            for (let prop in optionValues) {
                str.push(optionTypesDict[prop] + ' : ' + optionValuesDict[optionValues[prop]])
            }
            str = str.join(' -- ')
            res.push({ text: str, value: id, variant: variants[i] })
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
        let newSelected = { ...optionValues, ...obj };
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
        let {SetState} = this.context;
        return {html:<PopupHeader onClose={()=>SetState({product:false,productZIndex:0})} title='خرید کالا'/>}
    }
    body_layout() {
        let { product } = this.context;
        let { name, code, optionTypes, campaignsPrices, details, srcs } = product;
        let { srcIndex } = this.state;
        return {
            flex: 1,
            scroll: "v",
            gap: 12,
            style: { padding: "12px 0" },
            column: [
                this.image_layout(name, code, srcs[srcIndex]),
                this.options_layout(),
                this.optionTypes_layout(optionTypes),
                this.details_layout(details),
            ],
        };
    }
    image_layout(name, code, src) {
        let { product } = this.context, { srcIndex } = this.state;
        return {
            size: 346, className: "box",
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
                { size: 36, html: "کد کالا : " + (code || ""), className: "size14 color605E5C padding-0-12" },
                { size: 12 },
            ],
        };
    }
    options_layout() {
        let { product } = this.context;
        if (product.optionTypes.length < 2) { return false }
        return {
            className: 'box',
            column: [
                {
                    align: 'v', className: 'padding-12',
                    html: (
                        <AIOButton
                            type='select' className='product-exist-options main-bg'
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
            className: "box gap-no-color",
            column: [
                {
                    column: optionTypes.map(({ name, id, items = [] }, i) => {
                        return {
                            column: [
                                { size: 12 },
                                { size: 36, html: name, align: "v", className: "size14 color605E5C padding-0-12" },
                                { size: 6 },
                                {
                                    className: "padding-0-12", scroll: 'h', gap: 12,
                                    row: items.map((item) => {
                                        let active = optionValues[id] === item.id, style;
                                        let className = 'size14 padding-3-12 product-option-value';
                                        if (active) { className += ' active'; }
                                        return { html: item.name, align: "vh", className, style, attrs: { onClick: () => this.changeOptionType({ [id]: item.id }), } };
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
            className: "box",
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
    footer_layout() {
        return {
            size: 72, style: { background: "#fff" }, className: "padding-0-12",
            row: [this.addToCart_layout(), { flex: 1 }, this.price_layout()],
        };
    }
    addToCart_layout() {
        let { getCartCountByVariantId } = this.context;
        let { selectedVariant } = this.state;
        if (!selectedVariant || !selectedVariant.inStock || selectedVariant.inStock === null) {
            return { html: '' }
        }
        let count = getCartCountByVariantId(selectedVariant.id)
        if (!count) {
            return {
                html: (<button onClick={() => this.changeCount(1)} className={"button-2" + (!selectedVariant ? " disabled" : "")}>افزودن به سبد خرید</button>),
                align: "v",
            };
        }
        return { size: 96, html: () => <ProductCount value={count} onChange={(count) => this.changeCount(count)} max={this.getInStock()} /> }
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
                    show: !!selectedVariant.discountPercent,
                    row: [
                        { flex: 1 },
                        { html: selectedVariant.discountPrice, className: "colorA19F9D" },
                        { size: 6 },
                        {
                            html: "%" + selectedVariant.discountPercent,
                            style: { background: "#FDB913", color: "#fff", borderRadius: 8, padding: "0 3px" },
                        },
                    ],
                },
                {
                    row: [
                        { flex: 1 },
                        { html: selectedVariant.price, className: "color323130 bold" },
                        { size: 6 },
                        { html: "ریال", className: "color323130 bold" },
                    ],
                },
                { flex: 1 },
            ],
        };
    }
    render() {
        let {productZIndex:zIndex} = this.context;
        return (
            <RVD
                layout={{
                    className: "bgFFF fixed",
                    style:{zIndex},
                    column: [this.header_layout(), this.body_layout(), this.footer_layout()],
                }}
            />
        );
    }
}