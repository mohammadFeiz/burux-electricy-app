import React, { Component } from "react";
import RVD from "react-virtual-dom";
import getSvg from "./../../utils/getSvg";
import appContext from "../../app-context";
import AIOButton from "./../../coponents/aio-button/aio-button";
import layout from "./../../layout";
import src1 from "./../../utils/brx66.png";
import "./index.css";
import services from "../../services";

export default class Buy extends Component {
  static contextType = appContext;
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      view: "main", //main,category,product
      viewCategory: false,
      activeProduct: false,
      activeCampaignId: false,
      activeCampaignItems: [],
      activeCategoryName: "",
      campaigns: [],
      tabs: [
        { title: "نمایشگاه", id: "1", flex: 1 },
        { title: "دسته بندی کالاها", id: "2", flex: 1 },
      ],
      activeTabId: "1",
      lastOrders: [],
      recommendeds: [],
      bestSellings: [],
      families: [],
      preOrders: { waitOfVisitor: 0, waitOfPey: 0 },
      categories: [],
    };
  }
  getProduct() {
    return {
      name: "لامپ LED جنرال 10 وات بروکس",
      code: "213654",
      id: "b",
      details: [
        ["تعداد در کارتن", "100عدد"],
        ["سرپیچ", "بزرگ"],
      ],
      optionTypes: [
        {
          name: "رنگ",
          id: "color",
          items: [
            { name: "زرد", id: "yellow" },
            { name: "یخی", id: "ice" },
            { name: "سفید", id: "white" },
          ],
        },
        {
          name: "توان",
          id: "power",
          items: [
            { name: "10 وات", id: "10wat" },
            { name: "15 وات", id: "15wat" },
          ],
        },
      ],
      variants: [
        {
          optionValues: { color: "yellow", power: "10wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "1",
        },
        {
          optionValues: { color: "ice", power: "10wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "2",
        },
        {
          optionValues: { color: "yellow", power: "15wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "3",
        },
        {
          optionValues: { color: "white", power: "10wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "4",
        },
        {
          optionValues: { color: "white", power: "15wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "5",
        },
        {
          optionValues: { color: "ice", power: "10wat" },
          discountPrice: 10,
          discountPercent: 10,
          price: 230000,
          inStock: true,
          id: "6",
        },
      ],
      campaignsPrices: [
        { name: "خرید عادی", price: false, id: "10178" },
        { name: "فروش ویژه 10 وات", price: 235600, id: "10181" },
      ],
    };
  }
  async getCampaignsData() {
    let {allProducts} = this.context;
    let campaigns = await services("getCampaigns");
    let activeCampaignId = campaigns[0].id;
    let activeCampaignItems = await services("activeCampaignItems",{id:activeCampaignId,allProducts,count:10});
    this.setState({ campaigns, activeCampaignId, activeCampaignItems });
  }
  async getPreOrders() {
    let {allProducts} = this.context;
    let preOrders = await services("preOrders",{allProducts});
    this.setState({ preOrders });
  }
  async getCategories() {
    let {allProducts} = this.context;
    let categories = await services("getCategories",{allProducts});
    this.setState({ categories });
  }
  async getFamilies() {
    let {allProducts} = this.context;
    let families = await services('families',{allProducts});
    this.setState({ families });
  }
  async getRecommendeds(count) {
    let {allProducts} = this.context;
    let recommendeds = await services('recommendeds',{allProducts,count});
    if(count){this.setState({ recommendeds });}
    else {return recommendeds}
  }
  async getLastOrders(count) {
    let {allProducts} = this.context;
    let lastOrders = await services("lastOrders",{allProducts,count});
    this.setState({ lastOrders });
    if(count){this.setState({ lastOrders });}
    else {return lastOrders}
  }
  async getBestSellings(count) {
    let {allProducts} = this.context;
    let bestSellings = await services('bestCellings',{allProducts,count});
    if(count){this.setState({ bestSellings });}
    else {return bestSellings}
  }
  getActiveFamilyItems() {
    return [
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
        stockType: false,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
        stockType: "نورواره 2",
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
      {
        src: src1,
        name: "لامپ حبابی 10 وات بروکس",
        discountPrice: 60000,
        discountPercent: 30,
        price: 50000,
      },
    ];
  }
  //dont set async for parallel data fetching
  componentDidMount() {
    this.getCampaignsData();
    this.getLastOrders(10);
    this.getFamilies();
    this.getPreOrders();
    this.getRecommendeds(10);
    this.getBestSellings(10);
    this.getCategories();
  }
  selectCampaignLayout() {
    let {allProducts} = this.context;
    let { campaigns, activeCampaignId } = this.state;
    return {
      className: "box gap-no-color",
      style: { padding: 12 },
      column: [
        { align: "v", html: "طرح فعال", className: "color323130 size14 bold" },
        { size: 12 },
        {
          scroll: "h",
          gap: 16,
          row: campaigns.map(({ name, id, color, background }) => {
            let active = activeCampaignId === id;
            let style = active ? { color, background } : {};
            return {
              html: layout("checkButton", {
                text: name,
                active,
                ...style,
                onClick: async () => {
                  let activeCampaignItems = await services("activeCampaignItems",{id,allProducts,count:10});
                  this.setState({ activeCampaignId: id, activeCampaignItems });
                },
              }),
            };
          }),
        },
      ],
    };
  }
  viewCampaignLayout() {
    let { activeCampaignItems } = this.state;
    let {allProducts} = this.context;
    return {
      size: 292,
      style: {
        background: this.activeCampaign.background,
        color: this.activeCampaign.color,
        padding: 16,
      },
      gap: 16,scroll:'h',
      row: [
        {
          size: 100,
          style:{overflow:'hidden'},
          childsAttrs: { className: "bold" },
          column: [
            { size: 12 },
            {
              html: this.activeCampaign.text,
              style: { fontSize: 22 },
              align: "vh",
            },
            { flex: 1 },
            { size: 12 },
            {
              align: "vh",
              size: 100,
              html: <img src={src1} alt="" height="100%" />,
            },
            {
              align: "vh",
              html: "مشاهده همه",
              attrs: {
                onClick: async () =>this.showCategory(await services('activeCampaignItems',{allProducts}),this.activeCampaign.name)
              }
            },
            { size: 12 },
          ],
        },
        {
          gap: 16,
          row: activeCampaignItems.map((o) =>
            layout("productCard", { ...o })
          ),
        },
      ],
    };
  }
  preOrdersLayout() {
    let { preOrders } = this.state;
    return {
      className: "box gap-no-color",
      style: { padding: 12 },
      column: [
        {
          html: "پیش سفارشات",
          className: "size14 color323130 bold",
          size: 36,
          align: "v",
        },
        {
          gap: 12,
          size: 120,
          row: [
            {
              style: { background: "#fafafa", borderRadius: 12 },
              flex: 1,
              column: [
                {
                  html: "در انتظار تایید ویزیتور",
                  align: "vh",
                  size: 48,
                  className: "size14 color605E5C bold",
                },
                { html: preOrders.waitOfVisitor, align: "vh", flex: 1 },
              ],
            },
            {
              style: { background: "#fafafa", borderRadius: 12 },
              flex: 1,
              column: [
                {
                  html: "در انتظار پرداخت",
                  align: "vh",
                  size: 48,
                  className: "size14 color605E5C bold",
                },
                { html: preOrders.waitOfPey, align: "vh", flex: 1 },
              ],
            },
          ],
        },
      ],
    };
  }
  familiesLayout() {
    let { families } = this.state;
    return {
      className: "box gap-no-color",
      style: { padding: 12 },
      show: families.length !== 0,
      column: [
        {
          html: "محبوب ترین خانواده ها",
          className: "size14 color323130 bold",
          size: 36,
          align: "v",
        },
        {
          gap: 16,scroll:'h',
          row: families.map((o) => {
            let config = {
              ...o,
              src: src1,
              style: { border: "1px solid #ddd" },
              onClick: async () => {
                let activeFamilyItems = this.getActiveFamilyItems(o.id);
                this.setState({
                  view: "category",
                  activeCategoryName: o.name,
                  activeCategoryItems: activeFamilyItems,
                });
              },
            };
            return layout("productCard", config);
          }),
        },
      ],
    };
  }
  bestCellingsLayout() {
    let { bestSellings } = this.state;
    let title =  "پر فروش ترین محصولات";
    return {
      className: "box gap-no-color",show:bestSellings.length > 0,
      style: { padding: 12 },
      column: [
        {
          size:36,
          row:[
            {html:title,className: "size14 color323130 bold",align: "v"},
            {size:6},
            {
              html: "مشاهده همه",className: "size12 color0094D4 bold",align: "v",
              attrs:{
                onClick:async ()=>{
                  this.showCategory(await this.getBestSellings(),title)
                }
              }
            },
          ]
        },
        {
          gap: 16,scroll:'h',
          row: bestSellings.map((o) =>layout("productCard", {...o,style: { border: "1px solid #ddd" }})),
        },
      ],
    };
  }
  lastOrdersLayout() {
    let { lastOrders } = this.state;
    let title = "آخرین سفارشات شما";
    return {
      className: "box gap-no-color",
      style: { padding: 12 },
      column: [
        {
          size:36,
          row:[
            {html: title,className: "size14 color323130 bold",align: "v"},
            {size:6},
            {
              html: "مشاهده همه",className: "size12 color0094D4 bold",align: "v",
              attrs:{
                onClick:async ()=>{
                  this.showCategory(await this.getLastOrders(),title)
                }
              }
            },
          ]
        },
        {
          gap: 16,scroll:'h',
          row: lastOrders.map((o) =>
            layout("productCard", {...o,style: { border: "1px solid #ddd" }})
          ),
        },
      ],
    };
  }
  recommendedsLayout() {
    let { recommendeds } = this.state;
    let title =  "پیشنهاد سفارش";
    return {
      className: "box gap-no-color",
      style: { padding: 12 },
      column: [
        {
          size:36,
          row:[
            {html:title,className: "size14 color323130 bold",align: "v"},
            {size:6},
            {
              html: "مشاهده همه",className: "size12 color0094D4 bold",align: "v",
              attrs:{
                onClick:async ()=>{
                  this.showCategory(await this.getRecommendeds(),title)
                }
              }
            },
          ]
        },
        {
          gap: 16,scroll:'h',
          row: recommendeds.map((o) =>
            layout("productCard", {...o,style: { border: "1px solid #ddd" }})
          ),
        },
      ],
    };
  }
  tab1Layout() {
    return {
      flex: 1,
      scroll: "v",
      className:'buy-tab-1',
      gap: 12,
      column: [
        this.selectCampaignLayout(),
        this.viewCampaignLayout(),
        this.preOrdersLayout(),
        this.bestCellingsLayout(),
        this.familiesLayout(),
        this.lastOrdersLayout(),
        this.recommendedsLayout(),
      ],
    };
  }
  tab2Layout() {
    let { categories } = this.state;
    return {
      flex: 1,
      scroll: "v",
      gap: 12,
      column: categories.map((o) => {
        let { name, items } = o;
        return {
          flex: 1,
          className: "box gap-no-color",
          style: { padding: 12 },
          attrs: {
            onClick: () => {},
          },
          column: [
            {
              html: name,
              className: "size14 color323130 bold",
              size: 36,
              align: "v",
            },
            {
              flex: 1,
              html: "تصویر",
              className: "size14 color323130 bold",
              size: 36,
              align: "vh",
            },

            //{ gap: 16, row: items.map((o) => layout('productCard', { ...o, src: src1, style: { border: '1px solid #ddd' } })) }
          ],
        };
      }),
    };
  }
  showCategory(items,name){
    this.setState({
      view: "category",
      activeCategoryItems: items,
      activeCategoryName: name,
    })
  }
  categoryLayout() {
    let { view, activeCategoryItems, searchValue, activeCategoryName } = this.state;
    if (view !== "category") {return { html: "" };}
    return {
      flex: 1,style:{overflow:'hidden'},
      column: [
        {
          size: 36,
          html: activeCategoryName,
          align: "vh",
          className: "color605E5C size14 bold",
        },
        {
          flex: 1,
          scroll: "v",
          gap: 12,
          show: view === "category",
          column: activeCategoryItems.map((o) => {
            if (searchValue && o.name.indexOf(searchValue) === -1) {
              return false;
            }
            return layout("productCard2", {...o,onClick:()=>{
              this.setState({
                view:'product',
                activeProduct:o
              })
            }});
          }),
        },
      ],
    };
  }

  cartButtonLayout() {
    let { view } = this.state;
    if (view === "cart") {
      return { html: "" };
    }
    let { cart } = this.context;
    let badge = 0;
    let variantIds = Object.keys(cart).map((o) => o);
    for (let i = 0; i < variantIds.length; i++) {
      let id = variantIds[i];
      let { count = 0 } = cart[id];
      badge += count;
    }
    return {
      html: (
        <AIOButton
          type="button"
          style={{ background: "none" }}
          text={getSvg(45)}
          badge={badge ? badge : undefined}
          badgeAttrs={{ className: "badge-1" }}
          onClick={() => this.setState({ view: "cart" })}
        />
      ),
    };
  }
  headerLayout() {
    let { campaigns, activeCampaignId, view } = this.state;
    let { SetState } = this.context;
    console.log(activeCampaignId);
    return {
      className: "buy-header",
      size: 60,
      childsProps: { align: "vh" },
      row: [
        {
          size: 60,
          html: getSvg(22),
          attrs: { onClick: () => SetState({ sidemenuOpen: true }) },
          show: view === "main",
        },
        {
          size: 60,
          html: getSvg("chevronLeft", { flip: true }),
          attrs: { onClick: () => this.setState({ view: "main" }) },
          show: view !== "main",
        },
        {
          html: {
            main: "خرید کالا",
            category: "خرید کالا",
            product: "خرید کالا",
            cart: "سبد خرید",
          }[view],
          className: "size16 color605E5C",
        },
        { flex: 1 },
        {
          html: (
            <AIOButton
              type="select"
              className="buy-tarh-button"
              before={getSvg(44)}
              gap={6}
              caret={false}
              value={activeCampaignId}
              optionStyle={'{borderBottom:"1px solid #ddd"}'}
              optionValue="option.id"
              optionText="option.name"
              text={this.activeCampaign.name}
              options={campaigns}
              onChange={(value) => this.setState({ activeCampaignId: value })}
            />
          ),
        },
        { size: 16 },
        this.cartButtonLayout(),
        { size: 16 },
      ],
    };
  }
  searchLayout() {
    let { searchValue, view } = this.state;
    if (view !== "category" && view !== "main") {
      return { html: "" };
    }
    return layout("search", {
      onChange: (searchValue) => this.setState({ searchValue }),
      value: searchValue,
    });
  }
  tabsLayout() {
    let { tabs, activeTabId, view } = this.state;
    if (view !== "main") {return { html: "" };}
    return {
      flex: 1,style:{overflow:'hidden'},
      column: [
        layout("tabs", {tabs,activeTabId,onClick: (obj) => this.setState({ activeTabId: obj.id })}),
        activeTabId === "1" ? this.tab1Layout() : this.tab2Layout(),
      ],
    };
  }
  productLayout() {
    let { cart, SetState } = this.context;
    let { activeProduct, activeCampaignId, view } = this.state;
    if (view !== "product") {
      return { html: "" };
    }
    return {
      flex: 1,
      html: (
        <Product
          product={activeProduct}
          onClose={() => this.setState({ activeProduct: false, view: "main" })}
          activeCampaignId={activeCampaignId}
          cart={cart}
          changeCart={(id, count) => {
            let { cart } = this.context;
            cart[id] = cart[id] || {};
            cart[id].count = count;
            cart[id].variant = activeProduct.variants.filter(
              (o) => o.id === id
            )[0];
            cart[id].product = activeProduct;
            SetState({ cart });
          }}
        />
      ),
    };
  }
  cartLayout() {
    let { view } = this.state;
    if (view !== "cart") {
      return { html: "" };
    }
    let { splitPrice, cart } = this.context;
    let ids = Object.keys(cart);
    let cartItems = ids.map((o, i) => {
      let { product, count, variant } = cart[o];
      let { name, optionTypes } = product;
      let { price, discountPrice, discountPercent, optionValues } = variant;
      let details = [];
      for (let j = 0; j < optionTypes.length; j++) {
        let optionType = optionTypes[j];
        details.push([optionType.name, optionValues[optionType.id]]);
      }
      return {
        name,
        Qty: count,
        src: src1,
        price,
        discountPrice,
        discountPercent,
        isFirst: i === 0,
        isLast: i === ids.length - 1,
      };
    });
    return {
      flex: 1,
      column: [
        {
          flex: 1,
          column: cartItems.map((o) => layout("productCard2", o)),
        },
        {
          size: 72,
          className: "main-bg padding-0-12",
          row: [
            {
              flex: 1,
              column: [
                { flex: 1 },
                {
                  align: "v",
                  html: "مبلغ قابل پرداخت",
                  className: "color5757656 size12",
                },
                {
                  align: "v",
                  html: splitPrice(2000000) + " تومان",
                  className: "color323130 size16",
                },
                { flex: 1 },
              ],
            },
            {
              html: <button className="button-2">ادامه فرایند خرید</button>,
              align: "v",
            },
          ],
        },
      ],
    };
  }
  render() {
    let { campaigns, activeCampaignId } = this.state;
    this.activeCampaign =
      activeCampaignId !== false
        ? campaigns.filter((o) => o.id === activeCampaignId)[0]
        : {};
    return (
      <>
        <RVD
          layout={{
            flex: 1,
            className: "buy-page main-bg",
            style: { width: "100%" },
            column: [
              this.headerLayout(),
              this.searchLayout(),
              this.tabsLayout(),
              this.categoryLayout(),
              this.productLayout(),
              this.cartLayout(),
            ],
          }}
        />
      </>
    );
  }
}
class Product extends Component {
  static contextType = appContext;
  constructor(props) {
    super(props);
    let { product } = this.props;
    let firstVariant = product.inStock?product.variants.filter((o) => o.inStock === null?false:!!o.inStock)[0]:undefined;
    this.state = {
      optionValues: firstVariant?{ ...firstVariant.optionValues }:undefined,
      selectedVariant: firstVariant,srcIndex:0
    };
  }
  getVariantBySelected(selected) {
    let { product } = this.props;
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
  getVariantInOtherCampaign(selected) {
    return ["نورواره 2", 23000];
  }
  changeOptionType(key, value) {
    let { optionValues } = this.state;
    let newSelected = { ...optionValues, [key]: value };
    let variant = this.getVariantBySelected(newSelected);
    let variantInOtherCampaign;
    if (!variant) {
      variantInOtherCampaign = this.getVariantInOtherCampaign(newSelected);
    }
    this.setState({
      optionValues: newSelected,
      selectedVariant: variant,
      variantInOtherCampaign,
    });
  }
  optionTypesLayout(optionTypes) {
    let { optionValues } = this.state;
    if(!optionValues || !optionTypes){return {html:''}}
    return {
      className: "box gap-no-color",
      column: [
        {
          column: optionTypes.map(({ name, id, items = [] }) => {
            return {
              column: [
                { size: 12 },
                {
                  html: name,
                  align: "v",
                  className: "size14 color605E5C padding-0-12",
                },
                { size: 6 },
                {
                  className: "padding-0-12",
                  gap: 12,
                  row: items.map((item) => {
                    let active = optionValues[id] === item.id;
                    let style;
                    if (active) {
                      style = {
                        border: "2px solid #0094D4",
                        color: "#fff",
                        background: "#0094D4",
                        borderRadius: 6,
                      };
                    } else {
                      style = {
                        border: "2px solid #999",
                        color: "#605E5C",
                        borderRadius: 6,
                      };
                    }
                    return {
                      html: item.name,
                      align: "vh",
                      className: "size14 padding-3-12",
                      style,
                      attrs: {
                        onClick: () => this.changeOptionType(id, item.id),
                      },
                    };
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
  compairePricesLayout(campaignsPrices) {
    let { activeCampaignId } = this.props;
    let { splitPrice } = this.context;
    return {
      className: "box gap-no-color padding-6-12",
      column: [
        {
          size: 36,
          align: "v",
          html: "مقایسه قیمت در طرح ها",
          className: "size14 color605E5C",
        },
        {
          gap: 36,
          row: campaignsPrices.map((o) => {
            return {
              childsProps: { align: "vh", size: 30 },
              column: [
                {
                  html: o.name,
                  className:
                    activeCampaignId === o.id
                      ? "color0094D4 size12"
                      : "colorA19F9D size12",
                },
                {
                  html: o.price ? splitPrice(o.price) : "نا موجود",
                  className:
                    o.price || activeCampaignId !== o.id
                      ? "size16 color605E5C bold"
                      : "size14 colorD83B01 bold",
                },
              ],
            };
          }),
        },
      ],
    };
  }
  detailsLayout(details) {
    return {
      className: "box",
      style: { padding: 12 },
      html: (
        <div
          style={{display: "grid",gridTemplateColumns: "auto auto",gridGap: 1,width: "100%",background: "#DADADA"}}
        >
          {details.map((o) => {
            return (
              <>
                <div className="size12 color605E5C padding-6-12" style={{ background: "#F4F4F4" }}>{o[0]}</div>
                <div className="size12 color605E5C padding-6-12" style={{ background: "#F4F4F4" }}>{o[1]}</div>
              </>
            );
          })}
        </div>
      ),
    };
  }
  pictureLayout(name, code, src) {
    let {product} = this.props;
    let {srcIndex} = this.state;
    return {
      size: 346,
      className: "box",
      column: [
        { size: 24 },
        {
          flex: 1,style:{overflow:'hidden'},
          childsProps: { align: "vh" },
          row: [
            { size: 36, html: getSvg("chevronLeft", { flip: true }) ,style:{opacity:srcIndex === 0?0.5:1}},
            { flex: 1, html: <img src={src} alt="" height="100%" /> },
            { size: 36, html: getSvg("chevronLeft") ,style:{opacity:srcIndex === product?0.5:1} },
          ],
        },
        { size: 12 },
        {size: 36,html: name,className: "size16 color323130 bold padding-0-12"},
        {size: 36,html: "کد کالا : " + (code || ""),className: "size14 color605E5C padding-0-12"},
        { size: 12 },
      ],
    };
  }
  priceLayout() {
    let { selectedVariant, variantInOtherCampaign } = this.state;
    if (!selectedVariant) {
      if (!variantInOtherCampaign) {
        return { column:[{flex:1},{html:"ناموجود",className: "colorD83B01 bold size14" },{flex:1}]};
      }
      let [campaignName, campaignPrice] = variantInOtherCampaign;
      return {
        column: [
          { flex: 1 },
          {row: [{ flex: 1 },{html: "در این طرح موجود نیست",className: "colorD83B01 size12"}]},
          {
            childsProps: { align: "v" },
            gap: 6,
            row: [
              { html: "در طرح", className: "color605E5C size12" },
              { html: campaignName, className: "color605E5C size12" },
              { html: campaignPrice, className: "color323130 bold" },
              { html: "تومان", className: "color323130 bold" },
            ],
          },
          { flex: 1 },
        ],
      };
    }
    if(!selectedVariant.inStock){
      return { column:[{flex:1},{html:"ناموجود",className: "colorD83B01 bold size14" },{flex:1}]};
    }
    return {
      column: [
        { flex: 1 },
        {
          row: [
            { flex: 1 },
            { html: selectedVariant.discountPrice, className: "colorA19F9D" },
            { size: 6 },
            {
              html: "%" + selectedVariant.discountPercent,
              style: {background: "#FDB913",color: "#fff",borderRadius: 8,padding: "0 3px"},
            },
          ],
        },
        {
          row: [
            { flex: 1 },
            { html: selectedVariant.price, className: "color323130 bold" },
            { size: 6 },
            { html: "تومان", className: "color323130 bold" },
          ],
        },
        { flex: 1 },
      ],
    };
  }
  getSrcs(){
    let { product } = this.props;
    let { srcs = [] } = product;
    let {selectedVariant,srcIndex = 0} = this.state || {};
    if(selectedVariant && selectedVariant.srcs){
      if(selectedVariant.srcs[srcIndex]){return {srcIndex,src:selectedVariant.srcs[srcIndex]}}
      if(selectedVariant.srcs[0]){return {srcIndex:0,src:selectedVariant.srcs[0]}}
    }
    if(srcs[srcIndex]){return {src:srcs[srcIndex],srcIndex}}
    if(srcs[0]){return {srcIndex:0,src:srcs[0]}}
    return false;
  }
  bodyLayout() {
    let { product } = this.props;
    let { name, code, optionTypes, campaignsPrices, details, srcs } = product;
    let {srcIndex} = this.state;
    return {
      flex: 1,
      scroll: "v",
      gap: 12,
      style: { padding: "12px 0" },
      column: [
        this.pictureLayout(name, code, srcs[srcIndex]),
        this.optionTypesLayout(optionTypes),
        //this.compairePricesLayout(campaignsPrices),
        this.detailsLayout(details),
      ],
    };
  }
  getCountByVariant() {
    let { selectedVariant } = this.state;
    let { cart } = this.props;
    if (!Object.keys(cart).length) {return 0;}
    let obj = cart[selectedVariant.id];
    if (!obj) {return 0;}
    let { count = 0 } = cart[selectedVariant.id];
    return count;
  }
  addToCartLayout() {
    let { selectedVariant } = this.state;
    let { changeCart } = this.props;
    let count = this.getCountByVariant();
    if (!count) {
      return {
        html: (
          <button
            onClick={() => changeCart(selectedVariant.id, 1)}
            className={"button-2" + (!selectedVariant ? " disabled" : "")}
          >
            افزودن به سبد خرید
          </button>
        ),
        align: "v",
      };
    }
    return {
      childsProps: { align: "vh" },
      row: [
        {html: (<div onClick={()=>changeCart(selectedVariant.id, this.getCountByVariant() + 1)} className='product-count-button'>+</div>)},
        { size: 60, html: count },
        {html: (<div onClick={() =>changeCart(selectedVariant.id, this.getCountByVariant() - 1)} className='product-count-button'>-</div>)},
      ],
    };
  }
  footerLayout() {
    return {
      size: 72,style: { background: "#fff" },className: "padding-0-12",
      row: [this.addToCartLayout(), { flex: 1 }, this.priceLayout()],
    };
  }
  render() {
    return (
      <RVD
        layout={{
          className: "popup main-bg",
          column: [this.bodyLayout(), this.footerLayout()],
        }}
      />
    );
  }
}
