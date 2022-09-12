import React, { Component } from "react";
import RVD from "react-virtual-dom";
import getSvg from "./../../../utils/getSvg";
import appContext from "./../../../app-context";
import Table from "./../../../components/aio-table/aio-table";
import Header from "./../../../components/header/header";
import ProductCount from "./../../../components/product-count";
export default class SabteGarantiJadidBaJoziat extends Component {
    static contextType = appContext;
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            tableColumns: [
                {
                    title: "", width: 36,
                    cellAttrs: (row) => {
                        return {
                            onClick: () => {
                                let { items } = this.state;
                                this.setState({ items: items.filter((o) => row.Code !== o.Code) })
                            }
                        }
                    },
                    template: (row) => { return 'X' },
                },
                { title: "عنوان", getValue: (row) => row.Name },
                {
                    title: "تعداد", getValue: (row) => row.Qty, width: 120,
                    template: (row) => {
                        return (
                            <ProductCount value={row.Qty} onChange={(value) => {
                                let { items } = this.state;
                                row.Qty = value;
                                this.setState({ items });
                            }} />
                        )
                    }
                },
            ]
        };
    }
    async onSubmit() {
        let { services, SetState } = this.context;
        let { items } = this.state;
        let res = await services({ type: "sabte_kalahaye_garanti", parameter: items });
        if (res) {
            let {items,total} = await services({ type: "guaranteeItems" });
            SetState({
                guaranteeItems:items,
                totalGuaranteeItems:total,
                guaranteePopupSuccessText: "درخواست گارانتی شما با موفقیت ثبت شد",
                guaranteePopupSuccessSubtext: "درخواست گارانتی شما تا 72 ساعت آینده بررسی خواهد شد",
                guaranteePopupSuccessZIndex: 10,
                guaranteePopupSubmitZIndex: 0
            });
        }
        else {
            SetState({
                guaranteePopupSuccessText: "خطا",
                guaranteePopupSuccessZIndex: 10,
                guaranteePopupSubmitZIndex: 0
            });
        }
    }
    header_layout() {
        let { SetState } = this.context;
        return { html: <Header title='ثبت درخواست گارانتی جدید' onClose={() => SetState({ guaranteePopupSubmitZIndex: 0 })} /> }
    }
    hint_layout(text, subtext) {
        return {
            className: "box margin-0-12",
            style: { padding: 12 },
            column: [
                { html: text, className: "size16 color605E5C" },
                { size: 12 },
                {
                    row: [
                        { size: 16, html: getSvg(42), align: "vh" },
                        { size: 6 },
                        { flex: 1, className: "size12 color00B5A5", html: subtext }
                    ],
                },
            ],
        }
    }
    table_layout() {
        let { guaranteeExistItems } = this.context;
        let { tableColumns, items } = this.state;
        return {
            flex: 1,
            html: (
                <Table
                    paging={false} columns={tableColumns} model={items}
                    toolbarItems={[
                        {
                            type: "select", text: "افزودن کالا", className: 'button-1', optionText: 'option.Name', optionValue: 'option.Code',
                            popupAttrs: { style: { maxHeight: 400, bottom: 0, top: 'unset', position: 'fixed', left: 0, width: '100%' } },
                            options: guaranteeExistItems,
                            onChange: (value, obj) => {
                                let { items } = this.state;
                                items.push({ Name: obj.text, Code: obj.value, Qty: 1 });
                                this.setState({ items });
                            },
                        }
                    ]}
                />
            ),
        }
    }
    submit_layout(){
        let { items } = this.state;
        return {
            show: !!items.length,className:'padding-12', 
            html: <button disabled={!items.length} className='button-2' onClick={() => this.onSubmit()}>ثبت درخواست</button>, 
        }
    }
    render() {
        return (
            <RVD
                layout={{
                    className: "popup main-bg",
                    column: [
                        this.header_layout(),
                        this.hint_layout(
                            "تاریخ مراجعه ویزیتور : تا 72 ساعت آینده",
                            "ویزیتور جهت ثبت کالاهای گارانتی در تاریخ ذکر شده به فروشگاه شما مراجعه میکند"
                        ),
                        { size: 12 },
                        this.hint_layout(
                            "کالاهای گارانتی",
                            "با ثبت کالاهای درخواستی برای گارانتی، درخواست شما در اولویت قرار میگیرد."
                        ),
                        { size: 12 },
                        this.table_layout(),
                        this.submit_layout()
                    ],
                }}
            />
        );
    }
}