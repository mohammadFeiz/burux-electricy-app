import React,{Component,Fragment,createRef,createContext} from 'react';
import AIOButton from 'aio-button';
import $ from 'jquery';
  import Slider from 'r-range-slider';
import './index.css';
var AioTableContext = createContext();
export default class AIOTable extends Component{
  constructor(props){
    super(props);
    this.fn = new ATFN({
      getProps:()=>this.props,
      getState:()=>this.state,
      setState:(obj,caller)=>this.SetState(obj,caller),
      getContext:()=>this.context,
    })
    let touch = 'ontouchstart' in document.documentElement;
    this.dom = createRef();
    var {freezeSize,paging,columns,groups = []} = this.props;
    let cardRowCount = this.fn.getCardRowCount();
    let openDictionary = this.fn.getOpenDictionary();
    let copiedColumns = [...columns];
    this.state = {
      touch,openDictionary,cardRowCount,groups,groupsOpen:{},searchText:'',
      freezeSize,
      startIndex:0,
      //make imutable to prevent change of props.paging because that will compaire with next input props.paging
      paging:paging?{...paging}:false,
      prevPaging:JSON.stringify(paging),
      columns:copiedColumns,
      prevColumns:JSON.stringify(copiedColumns),
      focused:false,toggleAllState:true
    };
  }
  resizeDown(e){
    var {touch} = this.state;
    $(window).bind(touch?'touchmove':'mousemove',$.proxy(this.resizeMove,this));
    $(window).bind(touch?'touchend':'mouseup',$.proxy(this.resizeUp,this));
    this.resizeDetails = {
      client:this.fn.getClient(e),
      width:this.state.freezeSize,
    }
  }
  resizeMove(e){
    var {rtl} = this.props;
    var Client = this.fn.getClient(e);
    var {client,width} = this.resizeDetails;
    var offset = Client[0] - client[0];
    let newWidth = (width + offset * (rtl?-1:1));
    if(newWidth < 10){newWidth = 10}
    this.resizeDetails.newWidth = newWidth;
    $('#aio-table-first-split').css({width:newWidth});
  }
  resizeUp(){
    var {touch} = this.state;
    $(window).unbind(touch?'touchmove':'mousemove',this.resizeMove);
    $(window).unbind(touch?'touchend':'mouseup',this.resizeUp);
    this.setState({freezeSize:this.resizeDetails.newWidth});
  }
  getTable({sorts,freezeColumns,unFreezeColumns,columns}){
    let {freezeSize} = this.state;
    let {cardTemplate} = this.props;
    let freezeMode = freezeColumns.length !== 0 && unFreezeColumns.length !== 0;
    let rows = this.getRows(sorts,freezeMode);
    this.rows = rows;
    return (
       <div className={'aio-table-body'}>
        {!freezeMode && columns.length !== 0 && <AIOTableUnit rows={rows} columns={columns} type='cells'/>}
        {
          freezeMode &&
          <>
            <AIOTableUnit key={0} id='aio-table-first-split' rows={rows} columns={freezeColumns} tableIndex={0} type='freezeCells' style={{width:freezeSize}}/>
            <div className='aio-table-splitter' onMouseDown={(e)=>this.resizeDown(e)} onTouchStart={(e)=>this.resizeDown(e)}></div>
            <AIOTableUnit key={1} id='aio-table-second-split' rows={rows} columns={unFreezeColumns} tableIndex={1} type='unFreezeCells'/>
          </>
        }
        {
          cardTemplate && 
          <AIOTableUnit rows={rows}/>
        }
       </div> 
    )
  }
  getRows(sorts,freezeMode){
    var {model} = this.props;
    if(!model){return false}
    let {groups} = this.state;
    this.index = {render:0,real:0}
    let rows;
    rows = this.fn.getRowsNested([...model],'_childs');
    rows = this.fn.getRowsBySort(rows,sorts.filter(({active = true})=>active));
    rows = this.fn.getRows(rows,freezeMode);
    rows = this.fn.getRootsByPaging(rows,this.index);
    rows = this.fn.getRootsByGroup(rows,groups.filter(({active = true})=>active));
    return this.fn.getRowsByRoots(rows);
  }
  handleIncomingProps(){
    let {paging} = this.props;
    let {prevPaging} = this.state;
    let p = JSON.stringify(paging);
    if(p !== prevPaging){setTimeout(()=>this.setState({paging:{...paging},prevPaging:p}),0)}
  }
  getCellAttrs(row,column){
    let {cellAttrs = {}} = column;
    return (typeof cellAttrs === 'function'?cellAttrs(row):cellAttrs) || {}
  }
  SetState(obj,caller){
    this.setState(obj)
  }
  render(){
    this.handleIncomingProps();
    var {rowHeight,headerHeight,toolbarHeight,rowGap,className,columnGap,rtl,style,attrs = {},cardTemplate,onSwap,translate} = this.props;
    var {paging} = this.state;
    this.rh = rowHeight; this.hh = headerHeight; this.th = toolbarHeight; this.rg = rowGap; this.cg = columnGap;
    let details = this.fn.getDetails()
    var context = {
      ...this.props,...this.state,
      details,
      onDrag:(obj)=>this.dragStart = obj,
      
      onDrop:(obj)=>{
        if(!this.dragStart){return}
        if(this.dragStart._level !== obj._level){return}
        if(this.dragStart._level === 0){
          onSwap(this.dragStart,obj);
        }
        else{
          let startParents = this.dragStart._getParents().map((o)=>o._index).toString();
          let endParents = obj._getParents().map((o)=>o._index).toString();
          if(startParents !== endParents){return;}
          onSwap(this.dragStart,obj);
        }
      },
      SetState:this.SetState.bind(this),
      onScroll:(index)=>this.fn.onScroll(this.dom,index),
      getCellAttrs:this.getCellAttrs.bind(this),
      fn:this.fn,rows:this.rows
    }
    this.context = context;
    let table = this.getTable(details);
    return (
      <AioTableContext.Provider value={context}>
        <div className={'aio-table' + (className?' ' + className:'') + (rtl?' rtl':'')} tabIndex={0} ref={this.dom} style={{...style}} {...attrs}>
          <AIOTableToolbar {...details}/>
          {table}
          {
            paging &&
            <AIOTablePaging 
              rtl={rtl} translate={translate} paging={paging}
              onChange={(obj)=>{
                this.setState({paging:obj});
                if(paging.onChange){paging.onChange(obj)}
              }}
            />
          }
          {this.fn.getLoading(true)}
        </div>
      </AioTableContext.Provider>
    )
  }
}
AIOTable.defaultProps = {columns:[],toolbarHeight:36,rowGap:6,indent:16,translate:(text)=>text,freezeSize:300,groups:[]}
class AIOTableToolbar extends Component{
  static contextType = AioTableContext;
  state = {searchText:''}
  changeSearch(value,time = 1000){
    clearTimeout(this.searchTimeout);
    this.setState({searchText:value});
    this.searchTimeout = setTimeout(()=>this.context.SetState({searchText:value}),time);
  }
  getSearch(){
    let {translate} = this.context;
    let {search} = this.props;
    let {searchText} = this.state;
    if(!search){return <div style={{flex:1}} key='search'></div>}
    return (
      <div className='aio-table-search' key='search'>
        <input className='aio-table-search-input' type='text' value={searchText} placeholder={translate('Search')} onChange={(e)=>this.changeSearch(e.target.value)}/>
        {aioTableGetSvg(searchText?'close':'magnify',{onClick:()=>{if(!searchText){return} this.changeSearch('',0)}})}
      </div>
    )
  }
  render(){
    let {fn,rows,translate,rtl,toggleAllState,toolbarItems = [],SetState,toolbarAttrs = {},toggleAll,groups} = this.context;
    let {toggleOptions,freezeOptions,groupOptions,excelColumns,sortOptions} = this.props;
    let buttonProps = {
      type:'select',rtl,caret:false,className:'aio-table-toolbar-button',animate:true,
      popupAttrs:{style:{maxHeight:500}} 
    };
    let Sort,Toggle,Group,Freeze,Excel,ToggleAll;
    if(sortOptions.length){
      let title = translate('Sort')
      let props = {
        ...buttonProps,options:sortOptions,title,key:'sort',
        text:aioTableGetSvg('sort'),popupHeader:<div className='aio-table-popup-header'>{title}</div>
      }
      Sort = <AIOButton {...props}/>
    }
    if(toggleOptions.length){
      let title = translate('Show Columns')
      let props = {
        ...buttonProps,options:toggleOptions,title,key:'toggle',
        text:aioTableGetSvg('eye'),popupHeader:<div className='aio-table-popup-header'>{title}</div>
      }
      Toggle = <AIOButton {...props}/>
    }
    if(groupOptions.length){
      let title = translate('Group By')
      let props = {
        ...buttonProps,options:groupOptions,title,key:'group',
        text:aioTableGetSvg('group',{flip:rtl === true}),popupHeader:<div className='aio-table-popup-header'>{title}</div>,
        onSwap:(start,end,swap)=>SetState({groups:swap(groups,start,end)})
      }
      Group = <AIOButton {...props}/>
    }
    if(freezeOptions.length){
      let title = translate('Freeze')
      let props = {
        ...buttonProps,options:freezeOptions,title,key:'freeze',
        text:aioTableGetSvg('freeze'),popupHeader:<div className='aio-table-popup-header'>{title}</div>
      }
      Freeze = <AIOButton {...props}/>
    }
    if(toggleAll){
      let title = translate('Toggle All')
      let props = {
        ...buttonProps,title,key:'toggleAll',type:'button',
        text:!toggleAllState?aioTableGetSvg('toggleAllMinus'):aioTableGetSvg('toggleAllPlus'),
        onclick:()=>SetState(fn.getStateByToggleAll(rows))
      }
      ToggleAll = <AIOButton {...props}/>
    }
    if(excelColumns.length){
      let title = translate('Export To Excel')
      let props = {
        ...buttonProps,title,key:'excel',type:'button',text:aioTableGetSvg('excel'),
        onClick:()=>fn.exportToExcel(excelColumns,rows)
      }
      Excel = <AIOButton {...props}/>
    }
    return (
      <div className={'aio-table-toolbar' + (toolbarAttrs.className?' ' + toolbarAttrs.className:'')} style={{...toolbarAttrs.style}}>
        {ToggleAll}{Excel}
        {toolbarItems.map((o,i)=><AIOButton type='button' rtl={rtl} className='aio-table-toolbar-button' animate={true} {...o} key={'ti' + i}/>)}
        {this.getSearch()}
        {Group}{Sort}{Toggle}{Freeze}
      </div>
    )
  }
}
class AIOTablePaging extends Component{
  getPageNumber(type){
    let {paging} = this.props;
    let {pages = 1,number} = paging;
    let newNumber;
    if(type === 'prev'){newNumber = number - 1}
    else if(type === 'next'){newNumber = number + 1}
    else if(type === 'first'){newNumber = 1}
    else if(type === 'last'){newNumber = pages}
    if(newNumber < 1){newNumber = 1}
    if(newNumber > pages){newNumber = pages}
    return newNumber;
  }
  changePage(type){
    let {paging,onChange} = this.props;
    let {number} = paging;
    let newNumber = this.getPageNumber(type);
    if(newNumber === number){return;}
    onChange({...paging,number:newNumber})
  }
  render(){
    var {paging,onChange,rtl,translate = (str)=>str} = this.props;
    var {number,sizes = [1,5,10,20,30,40,50,60,70,80],size,pages = 1} = paging;
    return (
      <div className='aio-table-paging' style={{direction:'ltr'}}>
        <div 
          className='aio-table-paging-button' 
          onClick={()=>this.changePage(rtl?'last':'first')}
          title={translate(rtl?'Last Page':'First Page')}
        >{aioTableGetSvg('doubleChevronRight',{flip:true})}</div>
        <div 
          className='aio-table-paging-button' 
          onClick={()=>this.changePage(rtl?'next':'prev')}
          title={translate(rtl?'Next Page':'Previous Page')}
        >{aioTableGetSvg('chevronRight',{flip:true})}</div>
        <div className='aio-table-paging-number'>{rtl?pages + ' / ' + number:number + ' / ' + pages}</div>
        <div 
          className='aio-table-paging-button' 
          onClick={()=>this.changePage(rtl?'prev':'next')}
          title={translate(rtl?'Previous Page':'Next Page')}
        >{aioTableGetSvg('chevronRight')}</div>
        <div 
          className='aio-table-paging-button' 
          onClick={()=>this.changePage(rtl?'first':'last')}
          title={translate(rtl?'First Page':'Last Page')}
        >{aioTableGetSvg('doubleChevronRight')}</div>
        <select 
          className='aio-table-paging-button' value={size} 
          onChange={(e)=>onChange({...paging,size:parseInt(e.target.value)})}
          title={translate('Rows Count Per Page')}
        >{sizes.map((s,i)=><option key={i} value={s}>{s}</option>)}</select>
      </div>
    )
  }
}
class AIOTableUnit extends Component{
  static contextType = AioTableContext;
  constructor(props){
    super(props);
    this.dom = createRef();
  }
  getCardStyle(){
    let {columnGap,rowGap} = this.context;
    return {gridColumnGap:columnGap,gridRowGap:rowGap}
  }
  getStyle(){
    if(this.context.cardTemplate){
      return this.getCardStyle()
    }
    return this.getGridStyle()
  }
  getGridStyle(){
    var {rowGap,columnGap} = this.context;
    var {columns,style} = this.props;
    var gridTemplateColumns = '';
    this.gridTemplateColumns = [];
    for(let i = 0; i < columns.length; i++){
        let {width = 'auto'} = columns[i];
        width = width.toString();
        if(width !== 'auto' && width.indexOf('px') === -1){width += 'px'}
        this.gridTemplateColumns.push(width);
        gridTemplateColumns += width + (i < columns.length - 1?' ':''); 
    }
    return {gridTemplateColumns,gridRowGap:rowGap,gridColumnGap:columnGap,...style}
  }
  setStyle(gridTemplateColumns){
    $(this.dom.current).css({gridTemplateColumns:gridTemplateColumns.join(' ')});
  }
  getTitles(){
    var {columns} = this.props;
    return columns.map((column,i)=>{
      return (
        <AIOTableTitle 
          isLast={i === columns.length - 1}
          key={'title' + i} column={column} gridTemplateColumns={this.gridTemplateColumns} setStyle={this.setStyle.bind(this)}
          onDragStart={(index)=>this.startColumnSwap = index}
          onDragOver={(e,index)=>{e.preventDefault(); this.endColumnSwap = index;}}
          onDrop={(column)=>{
            let {SetState,columns} = this.context;
            if(column.movable === false){return;}
            if(this.startColumnSwap === undefined || this.startColumnSwap === this.endColumnSwap){return;}
            let startColumn = columns[this.startColumnSwap];
            let endColumn = columns[this.endColumnSwap];
            let newColumns = columns.map((c,j)=>{
              if(j === this.startColumnSwap){return endColumn}
              if(j === this.endColumnSwap){return startColumn}
              return c; 
            })
            SetState({columns:newColumns});
          }}
        />
      )
    })
  }
  keyDown(e){
    var {SetState} = this.context;
    if(e.keyCode === 27){
      $('.aio-table-input').blur();
      SetState({focused:false},'keyDown') 
    }
    else if([37,38,39,40].indexOf(e.keyCode) !== -1){this.arrow(e);}
  }
  arrow(e){
    var container = $(this.dom.current);
    var {rtl,focused,SetState} = this.context;
    var {columns} = this.props;
    let inputs = container.find('.aio-table-input');
    if(inputs.length === 0){return;}
    let focusedInput = inputs.filter(':focus');
    if(focused === false){
      let inputCells = $('.aio-table-cell-input');
      if(inputCells.length){
        let cell = inputCells.eq(0);
        SetState({focused:cell.attr('data-cell-id')});
        setTimeout(()=>{
          cell.find('.aio-table-input').focus().select();
        },10)      
      }
      return;
    }
    let [rowIndex,colIndex] = this.getCellIndex(focusedInput.parents('.aio-table-cell'));
    console.log(rowIndex,colIndex)
    if(e.keyCode === 40 || e.keyCode === 38){
      let sign = e.keyCode === 40?1:-1;
      e.preventDefault();
      rowIndex += sign;
      let next = inputs.filter(`[data-row-index=${rowIndex}][data-col-index=${colIndex}]`);
      while(rowIndex < this.renderIndex && rowIndex > 0 && next.length === 0){
        rowIndex += sign;
        next = inputs.filter(`[data-row-index=${rowIndex}][data-col-index=${colIndex}]`);
      }
      if(next.length){next.focus(); setTimeout(()=>next.select(),5)}
    }
    else if(e.keyCode === 39 || e.keyCode === 37){
      e.preventDefault();
      let sign = (e.keyCode === 37?-1:1) * (rtl?-1:1);
      colIndex += sign;
      let next = inputs.filter(`[data-row-index=${rowIndex}][data-col-index=${colIndex}]`);
      while(colIndex > 0 && colIndex < columns.length && next.length === 0){
        colIndex += sign;
        next = inputs.filter(`[data-row-index=${rowIndex}][data-col-index=${colIndex}]`);
      }
      if(next.length){next.focus(); setTimeout(()=>next.select(),5)}
    }
  }
  getCellIndex(cell){return [parseInt(cell.attr('data-row-index')),parseInt(cell.attr('data-col-index'))];}
  card(props){
    var {rowHeight,fn,cardTemplate,cardRowCount,search,searchText,indent} = this.context;
    var {tableIndex,columns} = this.props;
    var groupStyle = {gridColumnStart:1,gridColumnEnd:cardRowCount + 1,height:rowHeight};
    if(cardRowCount === 'auto'){groupStyle.gridColumnStart = undefined; groupStyle.gridColumnEnd = undefined;}
    let rows;
    if(search){
      rows = this.props.rows.filter((o)=>{
        if(searchText === ''){return true}
        try{return search(o.row,searchText)}
        catch{return false}
      })
    }
    else {rows = this.props.rows;}
    return (
      <div {...props} style={{...props.style,gridTemplateColumns:cardRowCount === 'auto'?undefined:`repeat(${cardRowCount},auto)`}}>
        {rows && rows.length !== 0 && rows.map((row,rowIndex)=>{
          if(row._groupId){return <AIOTableGroup {...{row,rowIndex,tableIndex}}/>}
          return (
            <div key={rowIndex + '-' + tableIndex} className='aio-table-card'>
              {
                row.row._level !== 0 && 
                <div style={{width:row.row._level * indent,border:'1px solid',height:'100%',position:'relative'}}>
                  <svg style={{background:'yellow',width:'100%',positon:'absolute',height:'100%'}}>

                  </svg>
                </div>
              }
              {cardTemplate(row.row,()=>fn.toggleRow(row.row))}  
            </div>
          ) 
        })}
        {rows && rows.length === 0 && fn.getNoData(columns)}
        {!rows && fn.getLoading()}
      </div>
    )
  
  }
  getPropValue(row,column,prop){return typeof prop === 'function'?prop(row,column):prop;}
  render(){
    var {onScroll,onSwap,onDrop,onDrag,fn,focused,SetState,striped,getCellAttrs} = this.context;
    var {rows,id,tableIndex,type,columns} = this.props;
    let props = {
      id,tabIndex:0,className:'aio-table-unit',style:this.getStyle(),ref:this.dom,
      onKeyDown:this.keyDown.bind(this),onScroll:(e)=>onScroll(tableIndex)
    }
    if(this.context.cardTemplate){return this.card(props)}
    this.renderIndex = -1;
    return (
      <div {...props}>
        {this.getTitles()}
        {rows && rows.length !== 0 && rows.map((o,i)=>{
          if(o._groupId){
            return <AIOTableGroup {...{tableIndex,row:o}} columns={columns} key={'group' + i + '-' + tableIndex}/>
          }
          this.renderIndex++;
          return o[type].map(({value,column},j)=>{
            let row = o.row;
            let cellId = i + '-' + j + '-' + tableIndex;
            let inlineEdit = this.getPropValue(row,column,column.inlineEdit);
            let attrs = getCellAttrs(row,column)
            return (
              <AIOTableCell 
                key={cellId}
                attrs={{
                  'data-row-index':this.renderIndex,
                  'data-col-index':column.renderIndex,
                  'data-real-row-index':row._index,
                  'data-real-col-index':column.realIndex,
                  'data-child-index':row._childIndex,
                  'data-childs-length':row._childsLength,
                  'data-lavel':row._level,
                  'data-cell-id':cellId,
                  tabIndex:0,
                  draggable:typeof onSwap === 'function' && column.swap,
                  onDrop:()=>onDrop(row),
                  onDragOver:(e)=>e.preventDefault(),
                  onDragStart:()=>onDrag(row),
                  onClick:()=>{
                    var {focused,SetState} = this.context;
                    if(attrs.onClick){attrs.onClick(row)}
                    if(!inlineEdit){return}
                    if(focused === false){
                      setTimeout(()=>fn.handleOutsideClick(),15)
                    }
                    SetState({focused:cellId},'cellonClick');
                    setTimeout(()=>$('.aio-table-input:focus').select(),20)
                  }
                }}
                striped={this.renderIndex % 2 === 0 && striped}
                value={value}
                column={column}
                row={row}
                inlineEdit={inlineEdit}
                before={this.getPropValue(row,column,column.before)}
                after={this.getPropValue(row,column,column.after)}
                justify={column.justify !== false && !column.treeMode}
              />
            )
          })
        })}
        {rows && rows.length === 0 && fn.getNoData(columns)}
        {!rows && fn.getLoading()}
      </div>
    )
  }
}
class AIOTableTitle extends Component{
  static contextType = AioTableContext;
  constructor(props){
    super(props);
    this.dom = createRef();
  }
  getStyle(style){
    let {headerHeight,columnGap} = this.context;
    return {height:headerHeight,top:0,borderLeft:columnGap?'none':undefined,borderRight:columnGap?'none':undefined,...style}
  }
  mouseDown(e,column){
    if(!column.resizable){return}
    this.resizeDown(e,column);
  }
  resizeDown(e,column){
    var {touch,fn} = this.context;
    var {gridTemplateColumns} = this.props;
    this.resized=false;
    $(window).bind(touch?'touchmove':'mousemove',$.proxy(this.resizeMove,this));
    $(window).bind(touch?'touchend':'mouseup',$.proxy(this.resizeUp,this));
    this.resizeDetails = {
      client:fn.getClient(e),
      width:parseInt(gridTemplateColumns[column.renderIndex]),
      column
    }
  }
  resizeMove(e){
    this.resized =true;
    var {rtl,fn} = this.context;
    var {setStyle,gridTemplateColumns} = this.props;
    var Client = fn.getClient(e);
    var {client,width,column} = this.resizeDetails;
    var offset = Client[0] - client[0];
    let newWidth = (width + offset * (rtl?-1:1));
    if(newWidth < parseInt(column.minWidth || 36)){newWidth = parseInt(column.minWidth || 36)}
    this.resizeDetails.newWidth = newWidth + 'px';
    gridTemplateColumns[column.renderIndex] = this.resizeDetails.newWidth;
    setStyle(gridTemplateColumns);
  }
  resizeUp(){
    $(window).unbind(touch?'touchmove':'mousemove',this.resizeMove);
    $(window).unbind(touch?'touchend':'mouseup',this.resizeUp);
    if(!this.resized){return;}
    var {touch,columns,SetState} = this.context;
    var {newWidth} = this.resizeDetails;
    let {column} = this.props;
    column = {...column,width:newWidth}
    if(column.storageKey){
      column = {...column,_storageObj:{...column._storageObj,width:newWidth}};
      localStorage.setItem('aio-table-column-storage-' + column.storageKey,JSON.stringify(column._storageObj));
    }
    columns = columns.map((c,i)=>i === column.realIndex?column:c)
    SetState({columns});
  }
  getGanttTitle(column){
    var {headerHeight,columnGap} = this.context
    var {template} = column;
    let {padding = 36} = template;
    var keys = template.getKeys();
    return <div className='aio-table-title aio-table-title-gantt' style={{padding:`0 ${+padding}px`,height:headerHeight,top:0,borderLeft:columnGap?'none':undefined,borderRight:columnGap?'none':undefined}} key={column.realIndex + 'title'}>
      <Slider
          start={0}
          end={keys.length - 1}
          labelStep={1}
          editLabel={(value)=>keys[value]}
          labelStyle={()=>{return {top:0}}}
          pointStyle={()=>{return {display:'none'}}}
          lineStyle={()=>{return {display:'none'}}}
      />
    </div>
  }
  render(){
    let {column,onDragStart,onDragOver,onDrop,isLast} = this.props;
    let {rtl} = this.context;
    if(column.template && column.template.type === 'gantt'){return this.getGanttTitle(column);}
    let title = typeof column.title === 'function'?column.title():column.title;
    let attrs = {...this.context.titleAttrs,...column.titleAttrs};
    let dataUniqId = 'aiotabletitle' + Math.round(Math.random() * 10000000)
    return (
      <div
        ref={this.dom}
        data-uniq-id={dataUniqId}
        style={this.getStyle(attrs.style)}
        draggable={false}
        className={'aio-table-title' + (attrs.className?' ' + attrs.className:'') + (isLast?' last-child':'') + (rtl?' rtl':' ltr')}
      >
        <AIOTableFilter column={column} dataUniqId={dataUniqId}/>
        <div
          className='aio-table-title-text'
          style={{justifyContent:column.titleJustify !== false?'center':undefined,cursor:column.movable === false?undefined:'move'}}
          draggable={column.movable !== false}
          onDragStart={()=>onDragStart(column.realIndex)}
          onDragOver={(e)=>onDragOver(e,column.realIndex)}
          onDrop={()=>onDrop(column)}
        >
          {title}
        </div>
        {
          column.width !== 'auto' && 
          <div
            className='aio-table-resize'
            style={{cursor:column.resizable?'col-resize':'default'}}
            draggable={false}
            onTouchStart={(e)=>this.mouseDown(e,column)}
            onMouseDown={(e)=>this.mouseDown(e,column)}
          ></div>
        }
      </div>
    )
  }
}
class AIOTableGroup extends Component{
  static contextType = AioTableContext;
  getStyle(){
    let {rowHeight,fn} = this.context;
    let {columns} = this.props;
    return {...fn.getFullCellStyle(columns),height:rowHeight}
  }
  getIcon(row){
    let {rtl} = this.context;
    if(row._opened){return aioTableGetSvg('chevronDown',{box:'2 1 20 20'})}
    return aioTableGetSvg('chevronRight',{flip:rtl === true})
  }
  click(row){
    let {SetState,groupsOpen} = this.context;
    var {_groupId} = row;
    groupsOpen[_groupId] = !groupsOpen[_groupId];
    SetState({groupsOpen});
  }
  render(){
    let {indent} = this.context;
    let {row,tableIndex} = this.props;
    return (
      <div className='aio-table-group' style={this.getStyle()}>
        {
          tableIndex !== 1 && 
          <>
            <div style={{width:indent * row._level,flexShrink:0}}></div>
            <div className='aio-table-toggle' onClick={()=>this.click(row)}>{this.getIcon(row)}</div>
            <div className='aio-table-cell-gap'></div>
            <div className='aio-table-group-text'>{row._groupValue}</div>
          </>
        }
      </div>
    )
  }
}
class AIOTableCell extends Component{
  static contextType = AioTableContext;
  constructor(props){
    super(props);
    this.dom = createRef();
    var {value} = this.props;
    this.state = {value,error:false,prevValue:value};
  }
  getStyle(column,row){
    var {template,minWidth = '30px'} = column;
    var {rowHeight,getCellAttrs} = this.context;
    let {striped} = this.props;
    var style = {height:rowHeight,overflow:template?undefined:'hidden',minWidth}
    if(column.template && column.template.type === 'gantt'){
      style.padding = 0
    }
    if(typeof striped === 'string'){style.background = striped}
    else if(Array.isArray(striped)){
      style.background = striped[0];
      style.color = striped[1];
    }
    let attrs = getCellAttrs(row,column);
    return {...style,...attrs.style}
  }
  getClassName(row,column){
    let {getCellAttrs} = this.context;
    var className = 'aio-table-cell';
    let {striped} = this.props;
    let attrs = getCellAttrs(row,column);
    if(striped === true){className += ' striped'}
    if(column.selectable !== false){className += ' aio-table-cell-selectable';}
    if(column.template && column.template.type === 'gantt'){className += ' aio-table-cell-gantt'}
    if(attrs.className){className += ' ' + attrs.className;}
    if(column.inlineEdit){className += ' aio-table-cell-input';}
    if(row._show === 'relativeFilter'){className += ' aio-table-relative-filter'}
    if(row._show === false){className += ' aio-table-cell-hidden'}  
    if(row._isFirstChild){className += ' first-child'}
    if(row._isLastChild){className += ' last-child'}
    return className;
  } 
  getToggleIcon(row){
    let {rtl,fn} = this.context;
    let icon;
    if(row._opened){icon = aioTableGetSvg('chevronDown')}
    else{icon = aioTableGetSvg('chevronRight',{flip:rtl === true})}
    return (
      <>
        <div className='aio-table-toggle' onClick={()=>fn.toggleRow(row)} style={{opacity:row._childsLength?1:0}}>{icon}</div>
        <div className='aio-table-cell-gap'></div>
      </>
    )
    
  }
  splitNumber(num){
    if(!num){return num}
    let str = num.toString()
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
        
  }
  getContentByTemplate(row,column,value){
    let {fn} = this.context;
    let template = typeof column.template === 'function'?column.template(row,column):column.template;
    if(!template){return value}
    if(template.type === 'slider'){return fn.getSliderCell(template,value)}
    if(template.type === 'checkbox'){return fn.getCheckboxCell(template,value,row)}
    if(template.type === 'options'){return fn.getOptionsCell(template,row)}
    if(template.type === 'split'){
      let newValue = this.splitNumber(value)
      if(template.editValue){newValue = template.editValue(newValue)}
      return newValue
    }
    if(template.type === 'gantt'){return fn.getGanttCell(row,template)} 
    return template
  }
  getContent(row,column,value){
    let {focused} = this.context;
    let {inlineEdit} = this.props;
    let template = this.getContentByTemplate(row,column,value);
    var content = '';
    if(inlineEdit && focused){content = this.getInput(row,column)}
    else{content = template;}
    if(column.subText){
      let subText;
      try{subText = column.subText(row);} catch{subText = ''}
      return (
        <div className='aio-table-cell-has-subtext'>
          <div style={{flex:1}}></div>
          <div className='aio-table-cell-uptext'>{content}</div>
          <div className='aio-table-cell-subtext'>{subText}</div>
          <div style={{flex:1}}></div>
        </div>
      )
    }
    return content;
  }
  async changeCell(value){
    let {row,column,inlineEdit} = this.props;
    let {fn} = this.context;
    let res;
    this.setState({loading:true})
    if(inlineEdit.onChange){res = await inlineEdit.onChange(row,value);}
    else if(typeof column.getValue === 'string'){
      res = await this.context.onChange(fn.setCellValue(row,column.getValue,value));
    } 
    this.setState({loading:false})
    return res;
  }
  getInput(row,column){
    let {fn} = this.context;
    let {attrs,inlineEdit} = this.props;
    let {type,getValue,disabled = ()=>false,options} = inlineEdit;
    let {value} = this.state;
    if(getValue){value = fn.getCellValue(row,getValue)}
    if(disabled(row)){
      if(typeof value === 'boolean'){return JSON.stringify(value)}
      return value
    }
    let props = {
      ...inlineEdit,
      className:'aio-table-input','data-row-index':attrs['data-row-index'],'data-col-index':attrs['data-col-index'],
      value:value === null || value === undefined?'':value,
    };
    
    
    if(type === 'text' || type === 'number'){
      return (
        <div className={'aio-table-input-container'}>
            <input 
              {...props}
              style={{textAlign:column.justify || type === 'number'?'center':undefined}}
              onChange={(e)=>this.setState({value:e.target.value})}
              onBlur={async (e)=>{
                let {value} = this.state;
                if(value === this.props.value){return}
                let newValue = value
                if(type === 'number'){
                  newValue = parseFloat(newValue);
                  if(isNaN(newValue)){newValue = 0;}
                }
                let res = await this.changeCell(newValue);
                if(typeof res === 'string'){this.setState({error:res})}
                else {this.setState({value:this.props.value})}
              }}
            />
            <div className='aio-table-input-border'></div>
        </div>
      )
    }
    if(type === 'select'){
      if(!options){console.error('aio table => missing options property of column inlineEdit with type="select"'); return '';}
      if(!Array.isArray(options)){console.error('aio table => options property of column inlineEdit with type="select" must be an array of objects . each object must have text and value property!!!'); return '';}
      return (
        <div className='aio-table-input-container'>
            <select 
              {...props}
              onFocus={()=>this.focus = true}
              onBlur={()=>this.focus = false}
              onChange={async (e)=>{
                let value = e.target.value;
                if(value === 'true'){value = true}
                if(value === 'false'){value = false}
                this.setState({value})
                let res = await this.changeCell(value);
                if(typeof res === 'string'){this.setState({error:res})}
                else if(res === false){this.setState({value:this.props.value})}
              }}
            >
              {options.map((o,i)=><option key={i} value={o.value}>{o.text}</option>)}
            </select>
            <div className='aio-table-input-border'></div>
        </div>
      )
    }
    if(type === 'checkbox'){
      return (
        <div className={'aio-table-input-container'} tabIndex={0} onKeyDown={async (e)=>{
          if(e.keyCode === 13){
              value = value === true?true:false;
              await this.changeCell(!value);
          }
        }}>
            <input 
              {...props}
              onFocus={()=>this.focus = true}
              onBlur={()=>this.focus = false}
              checked={value === true?true:false}
              onChange={async (e)=>{
                let value = e.target.checked;
                this.setState({loading:true})
                await this.changeCell(value);
                this.setState({loading:false})
              }}
            />
            <div className='aio-table-input-border'></div>
        </div>
      )
    }
    console.error('aio table => missing type property of column input');
    return '';
  }
  
  componentDidUpdate(){
    let {inlineEdit} = this.props;
    if(inlineEdit && this.focus){
      if(inlineEdit.type === 'select' || inlineEdit.type === 'checkbox'){
        $(this.dom.current).find('.aio-table-input').focus();
      }
    }
  }
  getProps(row,column,content){
    let attrs = this.context.getCellAttrs(row,column);
    let title = typeof content === 'string'?content:undefined;
    return {
      ref:this.dom,
      title,
      ...attrs,
      style:this.getStyle(column,row),
      className:this.getClassName(row,column),
    }
  }
  render(){
    let {indent,fn} = this.context;
    let {row,column,value,before,after,justify,attrs} = this.props;
    if(this.state.prevValue !== value){
      setTimeout(()=>this.setState({value,prevValue:value}),0);
    }
    let {error,loading} = this.state;
    let content = this.getContent(row,column,value);
    if(column.affix){
      content = content + ' ' + column.affix;
    }
    let cell;
    if(loading){return fn.cubes2()}
    if(error){
      cell = <div className='aio-table-error' onClick={()=>{
        this.setState({value:this.props.value,error:false});
      }}>{error}</div>
    }
    else{
      cell = (
        <>
          {column.treeMode && <div style={{width:row._level * indent,flexShrink:0}}></div>}
          {column.treeMode && this.getToggleIcon(row)}
          {
            before !== undefined &&
            <><div className='aio-table-icon'>{before}</div><div className='aio-table-cell-gap'></div></>
          }
          {
            content !== undefined &&
            <div className='aio-table-cell-content' style={{justifyContent:justify?'center':undefined}}>{content}</div>
          }
          {
            after !== undefined &&
            <><div style={{flex:1}}></div><div className='aio-table-icon'>{after}</div></>
          }
        </>
      )
    }
    return (
      <div {...attrs} {...this.getProps(row,column,content)}>
        {cell}
      </div>
    )
  }
} 
class AIOTableFilter extends Component{
  static contextType = AioTableContext;
  dom = createRef();
  async change(obj){
    let {SetState,columns} = this.context;
    let {column} = this.props;
    column = {...column,filter:{...column.filter,...obj}}
    let approve = true;
    if(column.filter.onChange){
      let loading = $(this.dom.current).parents('.aio-table').find('.aio-table-main-loading');
      loading.css({display:'flex'})
      approve = await column.filter.onChange(column.filter);
      loading.css({display:'none'})
    }
    if(approve !== false){SetState({columns:columns.map((o)=>o.realIndex === column.realIndex?column:o)})}
  }
  render(){
    var {rtl,translate} = this.context;
    var {column} = this.props;
    if(!column.filter || column.search){return null}
    let {items = [],booleanType = 'or',type = 'text'} = column.filter;
    let icon = items.length?aioTableGetSvg('filterActive',{className:'has-filter'}):aioTableGetSvg('filter');
    return (
      <div className='aio-table-filter-icon' ref={this.dom} onClick={()=>{
        $('.aio-table-title').css({zIndex:100});
        $(`[data-uniq-id = ${this.props.dataUniqId}]`).css({zIndex:1000})
      }}>
        <AIOButton
          type='button' rtl={rtl} caret={false} openRelatedTo='.aio-table' text={icon}
          popOver={()=>{
            return <AIOTableFilterPopup {...{translate,type,items,booleanType}} onChange={(obj)=>this.change(obj)}/>
          }}
        />
      </div>
    )
  }
}
export class AIOTableFilterPopup extends Component{
  render(){
    var {type,items,booleanType,onChange,translate = (str) => str} = this.props;
    var filterItems = items.map((item,i)=>{
      return (
        <Fragment key={i}>
          <AIOTableFilterItem item={item} type={type}
            onChange={(key,value)=>onChange({items:items.map((o,index)=>{if(i === index){return {...o,[key]:value}} return o})})}
            onRemove={()=>onChange({items:items.filter((o,index)=>index !== i)})}
            translate={translate}
          />
          {
            i < items.length - 1 &&
            <div className='aio-table-boolean' onClick={()=>onChange({booleanType:booleanType === 'or'?'and':'or'})}>{translate(booleanType)}</div>    
          }
        </Fragment>
      )
    })
    return (
      <div className='aio-table-filter-popup' style={{minWidth:250}}>
        {filterItems}
        <div className='aio-table-filter-footer'>
          <button 
            className='aio-table-filter-add' 
            onClick={()=>onChange({items:items.concat({operator:'contain',value:'',type})})}
          >{translate('Add')}</button>
        </div>
      </div>
    )
  }
}
class AIOTableFilterItem extends Component{
  constructor(props){
    super(props);
    var {item} = this.props;
    this.state = {value:item.value,prevValue:item.value}
  }
  changeValue(value){
    clearTimeout(this.timeout);
    this.setState({value});
    this.timeout = setTimeout(()=>{
      var {onChange} = this.props;
      onChange('value',value)  
    },1000)
  }
  getOptions(type,translate){
    let options = [];
    if(type !== 'number' && type !== 'date'){
      options.push(<option key='contain' value='contain'>{translate('Contain')}</option>)
      options.push(<option key='notContain' value='notContain'>{translate('Not Contain')}</option>)
    }
    options.push(<option key='equal' value='equal'>{translate('Equal')}</option>)
    options.push(<option key='notEqual' value='notEqual'>{translate('Not Equal')}</option>)
    if(type !== 'text'){
      options.push(<option key='greater' value='greater'>{translate('Greater')}</option>)
      options.push(<option key='less' value='less'>{translate('Less')}</option>)
    }
    return options;
  }
  render(){
    var {item,type,onChange,onRemove,translate} = this.props;
    if(this.state.prevValue !== item.value){
      setTimeout(()=>this.setState({value:item.value,prevValue:item.value}),0);
    }
    var {value} = this.state;
    return (
      <div className='aio-table-filter-item'>
        <select value={item.operator} onChange={(e)=>onChange('operator',e.target.value)}>{this.getOptions(type,translate)}</select>
        <div style={{width:'6px'}}></div>
        <input type={type === 'date'?'text':type} value={value} onChange={(e)=>this.changeValue(e.target.value)}/>
        <div style={{width:'6px'}}></div>
        <div className='aio-table-filter-remove' onClick={()=>onRemove()}>{aioTableGetSvg('close')}</div>     
      </div>
    )
  }
}
function ATFN({getProps,getState,setState,getContext}){
  let $$ = {
    fixPersianAndArabicNumbers (str){
      var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
      arabicNumbers  = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g];
      if(typeof str === 'string')
      {
        for(var i=0; i<10; i++)
        {
          str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }
      }
      return str;
    },
    getJSON(columns,rows){
      let result = [];
      for (let i = 0; i < rows.length; i++) {
        if(!rows[i].row){continue}
        let row = rows[i].row; 
        let obj = {}
        for (let j = 0; j < columns.length; j++) {
          let {title,realIndex} = columns[j];
          let res = row._values[realIndex];
          obj[title] = res !== undefined ? $$.fixPersianAndArabicNumbers(res) : "";
        }
        result.push(obj);
      }
      return result;
    },
    exportToExcel(columns,rows) {
        let {translate} = getProps();
        let name = window.prompt(translate('Inter Excel File Name'));
        // if (name === false || name === undefined || name === null) { return; }
        if (!name || name === null || !name.length) return;
        var data = $$.getJSON(columns,rows);
        var arrData = typeof data != "object" ? JSON.parse(data) : data;
        var CSV = "";
        // CSV += 'title';
        CSV += '\r\n\n';
        if (true) {
            let row = "";
            for (let index in arrData[0]) { row += index + ","; }
            row = row.slice(0, -1);
            CSV += row + "\r\n";
        }
        for (var i = 0; i < arrData.length; i++) {
            let row = "";
            for (let index in arrData[i]) { row += '"' + arrData[i][index] + '",'; }
            row.slice(0, row.length - 1);
            CSV += row + "\r\n";
        }
        if (CSV === "") { alert("Invalid data"); return; }
        var fileName = name.replace(/ /g, "_");
        var universalBOM = "\uFEFF";
        var uri = "data:text/csv;charset=utf-8," + encodeURIComponent(universalBOM + CSV);
        var link = document.createElement("a");
        link.href = uri;
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    getSliderCell(template,val){
      let {colors = ['#eee','dodgerblue'],start = 0,end = 100,value = val,editValue = (value)=>value} = template;
      let {rowHeight,rtl} = getProps();
      let [clr1 = '#eee',clr2 = 'dodgerblue'] = colors;
      let points = Array.isArray(value)?value:[value]
      if(points.length > 2){points = [points[0],points[1]]}
      return (
        <div className='aio-table-slider'>
          {points.length === 2 && <div style={{display:'flex',alignItems:'center',padding:'0 3px'}}>{editValue(points[0])}</div>}
          <Slider 
            style={{height:rowHeight}} direction={rtl?'left':'right'}
            start={start} end={end} step={0.1} pointStyle={()=>{return {display:'none'}}}
            lineStyle={()=>{return {height:5,borderRadius:6,background:clr1}}}
            fillStyle={(index,obj)=>{if(index === (points.length === 2?1:0)){return {height:5,background:clr2,borderRadius:6}}}}
            points={points}
          />
          <div style={{display:'flex',alignItems:'center',padding:'0 3px'}}>{editValue(points[points.length - 1])}</div>
        </div>
      )
    },
    getOptionsCell({options},row){
      return (
        <AIOButton
          type='select' caret={false}
          className='aio-table-options'
          text={aioTableGetSvg('dots')}
          options={options.map(({text,icon,onClick})=>{
            return {text,before:icon,onClick:()=>onClick(row)}
          })}
        />
      )
    },
    getCheckboxCell(template,value,row){
      let {color,onChange,size = 24} = template;
      let style = {width:size,height:size}
      if(!!value){
        return (
          <svg style={style} viewBox={`0,0,24,24`} className='aio-table-checkbox checked' onClick={()=>onChange(row,false)}>
            <path fill={color} d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z"></path>
          </svg>
        )
      }
      else{
        return (
          <svg style={style} viewBox={`0,0,24,24`} className='aio-table-checkbox' onClick={()=>onChange(row,true)}>
            <path fill={color} ng-attr-fill="{{icon.color}}" ng-attr-d="{{icon.data}}" d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z"></path>
          </svg>
        )
      }
    
    },
    getGanttCell(row,template){
      let {rtl} = getProps();
      let {getKeys,getColor = ()=>'#fff',getBackgroundColor = ()=>'#69bedb',getFlags = ()=>[],getProgress = ()=>false,getText = ()=>false,getStart,getEnd,padding = 36} = template;
      let keys = getKeys();
      if(!Array.isArray(keys)){
        console.error('aio table => gantt column => column getKeys property must return an array of strings');
        return '';
      }
      let color = $$.getCellValue(row,getColor);
      let backgroundColor = $$.getCellValue(row,getBackgroundColor);
      let progress = $$.getCellValue(row,getProgress);
      let text = $$.getCellValue(row,getText);
      let startIndex = keys.indexOf($$.getCellValue(row,getStart));
      let endIndex = keys.indexOf($$.getCellValue(row,getEnd));
      let background = progress === false?color:`linear-gradient(to ${rtl?'left':'right'},rgba(0,0,0,.2) 0%,rgba(0,0,0,.2) ${progress}% ,transparent ${progress}%,transparent 100%)`
      let flags = getFlags();
      return <Slider
        attrs={{style:{padding:`0 ${+padding}px`}}}
        start={0} 
        editValue={(value)=>keys[value]}
        end={keys.length - 1}
        points={[startIndex,endIndex]}
        fillStyle={(index)=>{
          if(index === 1){
            return {background:backgroundColor,backgroundImage:background}
          }
        }}
        getText={(index)=>{if(index === 1 && text){return text}}}
        textStyle={()=>{return {color}}}
        scaleStep={1}
        scaleStyle={(value)=>{
          let flag = flags.filter((o)=>keys.indexOf(o.value) === value)[0];
          if(flag){return {background:flag.color,height:'100%',top:0,zIndex:100}}
          return {height:'100%',top:0,opacity:.4};
        }}
        lineStyle={()=>{return {opacity:.4}}}
      />
    },
    handleOutsideClick(){
      $(window).unbind('click',$$.outSideClick);
      $(window).bind('click',$$.outSideClick);
    },
    outSideClick(e){
      let {focused} = getState();
      if(focused === false){return;}
      let target = $(e.target);
      if(target.hasClass('aio-table-cell')){return}
      if(target.parents('.aio-table-input-container').length){return}
      if(target.parents('.aio-table-cell-content').length){return}
      if(target.parents('.aio-table-cell').length){return}
      $(window).unbind('click',$$.outSideClick);
      setState({focused:false},'outsideClick')
    },
    getCardRowCount(){
      var {cardRowCount = 1} = getProps();
      if(typeof cardRowCount !== 'object'){return cardRowCount}
      let result,matched = false;
      for (let prop in cardRowCount){
        let count = cardRowCount[prop] 
        let a = window.matchMedia(`(max-width: ${prop}px)`);
        if(a.matches && !matched){
          matched = true;
          result = count
        }
        a.addListener(()=>setState({cardRowCount:count}))
      }
      return result;
    },
    async onScroll(dom,index){
      let {onScrollEnd} = getProps();
      if(onScrollEnd){
        if(index === undefined || index === 0){
          let table = $(dom.current).find('.aio-table-unit');
          let scrollTop = table.scrollTop();
          let scrollHeight = table[0].scrollHeight;
          let height = table.height();
          if(scrollTop + height === scrollHeight){
            let {startIndex} = getState();
            let {scrollLoadLength,scrollTotalLength} = getProps();
            let from = startIndex + scrollLoadLength;
            if(from > scrollTotalLength){return;}
            let to = from + scrollLoadLength;
            if(to > scrollTotalLength){to = scrollTotalLength;}
            let a = $(dom.current).find('.aio-table-main-loading')
            a.css({display:'flex'})
            let res = await onScrollEnd(from,to);
            a.css({display:'none'})
            if(res !== false){
              setState({startIndex:from})
            }
          }
        }
      }
      
      if(index === undefined){return}
      if(!$$['scroll' + index]){
        let otherIndex = Number(!index);
        $$['scroll' + otherIndex] = true;
        let c = $(dom.current);
        var units = [c.find('#aio-table-first-split'),c.find('#aio-table-second-split')]
        var scrollTop = units[index].scrollTop();
        units[otherIndex].scrollTop(scrollTop);
      }
      $$['scroll' + index] = false;
    },
    getOpenDictionary(){
      let {id} = getProps();
      if(id === undefined){return {}}
      let openDictionary = localStorage.getItem('aio table ' + id);
      if(openDictionary === null || openDictionary === undefined){
        localStorage.setItem('aio table ' + id,'{}');
        return {}
      }
      else{
        return JSON.parse(openDictionary);
      }
    },
    getDateNumber(value){
      let splitter;
      for(let i = 0; i < value.length; i++){
        if(isNaN(parseInt(value[i]))){splitter = value[i]; break}
      }
      let [year,month = '01',day = '01'] = value.split(splitter);
      let list = [year,month,day];
      return parseInt(list.map((o)=>o.length === 1?('0' + o):o).join(''))
    },
    setCellValue:(row,getValue,value)=>{//row is used in eval
      let {model} = getProps();
      let evalText;
      if(typeof value === 'string'){
        evalText = `row.${getValue} = "${value}"`;
      }
      else{
        evalText = 'row.' + getValue + ' = ' + JSON.stringify(value);
      }
      eval(evalText);
      return model;
    },
    getCellValue:(row,getValue)=>{
      try{
        if(typeof getValue === 'function'){return getValue(row);}
        if(typeof getValue === 'string'){
          let result;
          eval('result = row.' + getValue);
          return result;
        }
        return; 
      }
      catch{return;}
    },
    async onChangeSort(obj,colIndex){
      let {columns} = getState(); 
      columns = [...columns];
      let column = {...columns[colIndex]}
      column.sort = {...column.sort,...obj}                  
      let newColumns = columns.map((o,i)=>i === colIndex?column:o)
      let approve = true;
      if(column.sort.onChange){
        let {active = true,dir = 'inc'} = column.sort;
        approve = await column.sort.onChange({active,dir})          
      }
      if(approve !== false){
        setState({columns:newColumns})
      }
    },
    getSorts({column,sorts,sortOptions,columnTitle,colIndex}){
      let {sort} = column;
      let {title = columnTitle || '',getValue = column.getValue,type,active = true,toggle = true,dir = 'inc',onChange} = sort;
      if(type === 'date'){
        getValue = (row)=>{
          let {sort} = column;
          let {getValue = column.getValue} = sort;
          let value = $$.getCellValue(row,getValue);
          if(typeof value !== 'string'){return 0}
          return $$.getDateNumber(value)
        }  
      }
      sorts.push({title,dir,active,toggle,getValue,type,onChange});
      if(toggle){
        sortOptions.push({
          text:title,checked:!!active,
          onClick:()=>$$.onChangeSort({active:!active},colIndex),
          after:(
            <div style={{width:'30px',display:'flex',justifyContent:'flex-end'}}>
              {
                aioTableGetSvg(
                  dir === 'dec'?'arrowDown':'arrowUp',
                  {
                    onClick:(e)=>{
                      e.stopPropagation();
                      $$.onChangeSort({dir:dir === 'dec'?'inc':'dec'},colIndex)
                    }
                  }
                )
              }
            </div>
          )
        })
      }
    },
    getToggles(obj){
      let {column,toggleOptions,colIndex,columnTitle} = obj;
      let {columns} = getState();
      toggleOptions.push({
        text:columnTitle,checked:column.show !== false,
        onClick:()=>{
          //change columns imutable(prevent change columns directly)
          let column = {...obj.column,show:!obj.column.show};
          if(column.storageKey){
            column = {...column,_storageObj:{...column._storageObj,show:column.show}}
            localStorage.setItem('aio-table-column-storage-' + column.storageKey,JSON.stringify(column._storageObj));
          }
          setState({columns:columns.map((o,i)=>i === column.realIndex?column:o)});
        }
      })
    },
    getFreezes({column,colIndex,columnTitle,freezeOptions,freezeColumns,unFreezeColumns}){
      (column.freeze?freezeColumns:unFreezeColumns).push(column)
      if(!column.toggleFreeze){return}
      freezeOptions.push({
        text:columnTitle,checked:column.freeze === true,
        onClick:()=>{
          let {columns} = getState();
          columns = [...columns];
          let column = {...columns[colIndex]};
          column.freeze = !column.freeze;
          setState({columns:columns.map((o,i)=>i === colIndex?column:o)});
        }
      })
    },
    updateColumnByStorage(column){
      let {storageKey,_readStorage} = column;
      if(storageKey && !_readStorage){
        column._readStorage = true;
        let storageStr = localStorage.getItem('aio-table-column-storage-' + column.storageKey);
        let storageObj;
        if(!storageStr || storageStr === null){
          storageObj = {};
          localStorage.setItem('aio-table-column-storage-' + column.storageKey,'{}');
        }
        else{storageObj = JSON.parse(storageStr);}
        if(storageObj.show !== undefined){column.show = storageObj.show;}
        if(storageObj.width !== undefined){column.width = storageObj.width;}
        column._storageObj = storageObj;
      }
    },
    getDetails(){
      let {columns,groups} = getState();
      columns = [...columns]
      let sorts = [];
      let freezeColumns = [],unFreezeColumns = [],freezeOptions = [],sortOptions = [],toggleOptions = [],groupOptions = [];
      let excelColumns = [],visibleColumns = [],search = false;
      let groupTitles = groups.map((o)=>o.title)
      let renderIndex = 0;
      for(let i = 0; i < columns.length; i++){
        columns[i].realIndex = i;
        if(columns[i].sort === true){columns[i].sort = {}}
        if(columns[i].filter === true){columns[i].filter = {items:[],booleanType:'or',type:'text'}}
        if(columns[i].group === true){columns[i].group = {}} 
        columns[i].width = columns[i].width || 'auto';
        let column = {...columns[i]};
        column.realIndex = i;
        $$.updateColumnByStorage(column);
        let {title:columnTitle,show = true,sort,toggleShow,excel} = column;
        columnTitle = typeof columnTitle === 'function'?columnTitle():columnTitle; 
        column.show = typeof show === 'function'?show():show;  
        if(column.search){search = true}
        if(column.group && groupTitles.indexOf(columnTitle) === -1){
          let {title = columnTitle,active = true,toggle = true,storageKey = column.storageKey,getValue = column.getValue } = column.group;
          groups.push({title,active,toggle,storageKey,getValue})
        }
        if(column.show){
          column.renderIndex = renderIndex;
          columns[i].renderIndex = renderIndex;
          renderIndex++;
          visibleColumns.push(column);
          if(excel){excelColumns.push(column)}
          if(sort){$$.getSorts({column,columnTitle,sorts,sortOptions,colIndex:i})}
          $$.getFreezes({column,colIndex:i,columnTitle,freezeOptions,freezeColumns,unFreezeColumns})
        }
        if(toggleShow){$$.getToggles({column,columnTitle,toggleOptions,colIndex:i})}
      }
      $$.getGroups(groupOptions)
      return {sorts,sortOptions,freezeColumns,unFreezeColumns,freezeOptions,toggleOptions,groupOptions,excelColumns,columns:visibleColumns,search}
    },
    getGroups(groupOptions){
      var {groups} = getState();
      for(let i = 0; i < groups.length; i++){
        let group = groups[i];
        let {title,active = true,toggle = true,storageKey,_readStorage} = group;
        if(storageKey && !_readStorage){
          group._readStorage = true;
          let storageActive = localStorage.getItem('aio table group' + storageKey);
          if(storageActive === null){
            storageActive = true;
            localStorage.setItem('aio table group' + storageKey,JSON.stringify(storageActive))
          }
          else {storageActive = JSON.parse(storageActive)}
          active = storageActive;
        }
        group.active = active;
        if(toggle){
          groupOptions.push({
            text:title,checked:active === true,
            onClick:()=>{
              let {groups} = getState();
              let group = groups[i];
              group.active = !group.active;
              if(storageKey){
                localStorage.setItem('aio table group' + storageKey,JSON.stringify(group.active))
              }
              setState({groups});
            }
          })
        }
      }
    },
    isContain(text,subtext){return text.toString().toLowerCase().indexOf(subtext.toString().toLowerCase()) !== -1},
    isEqual(a,b){return a.toString().toLowerCase() === b.toString().toLowerCase()},
    isGreater(a,b,type){
      if(type === 'date'){return $$.getDateNumber(a) > $$.getDateNumber(b)}
      return parseFloat(a) > parseFloat(b)
    },
    isLess(a,b,type){
      if(type === 'date'){return $$.getDateNumber(a) < $$.getDateNumber(b)}
      return parseFloat(a) < parseFloat(b)
    },
    getFilterResult_and(filters,val){
      if(val === undefined){return false}
      for(let i = 0; i < filters.length; i++){
        let {operator:o,value:v,type} = filters[i];
        if(v === '' || v === undefined){continue;}
        if(o === 'contain'){if(!$$.isContain(val,v)){return false}continue} 
        if(o === 'notContain'){if($$.isContain(val,v)){return false}continue} 
        if(o === 'equal'){if(!$$.isEqual(val,v)){return false}continue}
        if(o === 'notEqual'){if($$.isEqual(val,v)){return false}continue}
        if(o === 'greater'){if(!$$.isGreater(val,v,type)){return false;}continue}
        if(o === 'less'){if(!$$.isLess(val,v,type)){return false;}continue}  
      }
      return true;
    },
    getFilterResult_or(filters,val){
      if(val === undefined){return false}
      for(let i = 0; i < filters.length; i++){
        let {operator:o,value:v,type} = filters[i];
        if(v === '' || v === undefined){return true;}
        if(o === 'contain'){if($$.isContain(val,v)){return true}continue} 
        if(o === 'notContain'){if(!$$.isContain(val,v)){return true}continue} 
        if(o === 'equal'){if($$.isEqual(val,v)){return true}continue}
        if(o === 'notEqual'){if(!$$.isEqual(val,v)){return true}continue}
        if(o === 'greater'){if($$.isGreater(val,v,type)){return true;}continue}
        if(o === 'less'){if($$.isLess(val,v,type)){return true;}continue}  
      }
      return false;
    },
    getFilterResult(column,value){
      let {items = [],booleanType = 'or'} = column.filter;
      if(items.length){
        return $$['getFilterResult_' + booleanType](items,value);
      }
      return true;
    },
    cubes2(obj = {}){
      var {count = 5,thickness = [5,16],delay = 0.1,borderRadius = 0,colors = ['dodgerblue'],duration = 1,gap = 3} = obj;
      let Thickness = Array.isArray(thickness)?thickness:[thickness,thickness];
      let getStyle1 = (i)=>{
        return {
          width:Thickness[0],height:Thickness[1],background:colors[i % colors.length],margin:`0 ${gap/2}px`,
          animation: `${duration}s loadingScaleY infinite ease-in-out ${i * delay}s`,
          borderRadius:borderRadius + 'px'
        }
      }
      let items = [];
      for(var i = 0; i < count; i++){
        items.push(<div key={i} style={getStyle1(i)}></div>)
      }
      return (
        <div className="rect" style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',background:'transparent'}}>
          {items}
        </div>
      )
    },
    getLoading(isMain){
      if(isMain){
        return <div className='aio-table-loading aio-table-main-loading' style={{display:'none'}}>{$$.cubes2({thickness:[6,40]})}</div>;
      }
      return <div className='aio-table-loading'>{$$.cubes2({thickness:[6,40]})}</div>;
    },
    toggleRow(row){
      var {openDictionary} = getState();
      var {id} = getProps();
      if(row._show === 'relativeFilter'){return;}
      openDictionary[row._id] = !openDictionary[row._id];
      if(id !== undefined){localStorage.setItem('aio table ' + id,JSON.stringify(openDictionary))}
      setState({openDictionary});
    },
    getRow(row){
      let {searchText} = getState();
      let {columns} = getContext().details
      row._values = {};
      let searchShow;
      let show = true,lastColumn,isThereAutoColumn = false,cells = [],freezeCells = [],unFreezeCells = [];
      for(let i = 0; i < columns.length; i++){
        let column = columns[i];
        let value = $$.getCellValue(row,column.getValue);
        row._values[column.realIndex] = value;
        if(show && column.search && searchText){
          if(searchShow === undefined){searchShow = false}
          searchShow = searchShow || JSON.stringify(value).toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        }
        if(show && column.filter && !column.filter.onChange){show = show && $$.getFilterResult(column,value)}
        let obj = {key:row._index + ',' + column.realIndex,column,value,freeze:column.freeze};
        if($$.freezeMode){
          if(column.freeze){
            freezeCells.push(obj);
          }
          else{
            lastColumn = column;
            unFreezeCells.push(obj);
            if(column.width === 'auto'){isThereAutoColumn = true;}
          }  
        }
        else{
          cells.push(obj);
          lastColumn = column;
          if(column.width === 'auto'){isThereAutoColumn = true;}
        }
      }
      row._show = show && searchShow !== false;
      if(show){
        let parents = row._getParents();
        for(let i = 0; i < parents.length; i++){
          if(parents[i]._show === false){parents[i]._show = 'relativeFilter';}
        }
      }
      if(!isThereAutoColumn && lastColumn){lastColumn.width = 'auto';}
      return {cells,freezeCells,unFreezeCells};
    },
    getRowById(id,rows){
      for(let i = 0; i < rows.length; i++){
        let row = rows[i];
        if(!row.row){continue;}
        if(row.row._id === id){return row}
      }
    },
    getStateByToggleAll(rows){
      var {openDictionary,groupsOpen,toggleAllState} = getState();
      var {id} = getProps();
      for(let prop in openDictionary){
        let row = $$.getRowById(prop,rows);
        if(row && row.row && row.row._show === 'relativeFilter'){continue;}
        openDictionary[prop] = toggleAllState;
      }
      for(let prop in groupsOpen){
        groupsOpen[prop] = toggleAllState;
      }
      if(id !== undefined){localStorage.setItem('aio table ' + id,JSON.stringify(openDictionary))}
      return {openDictionary,groupsOpen,toggleAllState:!toggleAllState};
    },
    getClient(e){return getState().touch?[e.changedTouches[0].clientX,e.changedTouches[0].clientY]:[e.clientX,e.clientY];},
    getRowsReq(model,rows,_level,parents,nestedIndex){
      var {openDictionary} = getState();
      var {getRowId,getRowChilds,getRowVisible,getRowParentId} = getProps();
      if(getRowParentId){getRowChilds = (row)=>row._childs}
      for(let i = 0; i < model.length; i++){
        let row = model[i];
        if(getRowVisible && getRowVisible(row) === false){continue}
        if(row._groupId){
          rows.push(row);
          continue;
        }
        row._index = $$.realIndex;
        $$.realIndex++;
        row._childIndex = i;
        let NI = nestedIndex.concat(i);
        row._nestedIndex = NI;
        row._level = _level;
        row._isFirstChild = i === 0;
        row._isLastChild = i === model.length - 1;
        row._getParents = ()=> parents;
        if(row._id === undefined){
          let id = getRowId?getRowId(row):'row' + Math.random();
          if(id === undefined){console.error('AIOTable => id of row is not defined, please check getRowId props of AIOTable')}
          row._id = id; 
        }
        openDictionary[row._id] = openDictionary[row._id] === false?false:true;
        row._opened = openDictionary[row._id];  
        row._childsLength = 0;
        let childs = [];
        if(getRowChilds){
          childs = $$.getCellValue(row,getRowChilds) || [];
          row._childsLength = childs.length;
        }
        let Row = $$.getRow(row);
        if(row._level === 0){rows.push([])}
        rows[rows.length - 1].push({...Row,row});
        if(row._opened && row._childsLength){
          $$.getRowsReq(childs,rows,_level + 1,parents.concat(row),NI);
        }
        else{$$.realIndex += row._childsLength;}
      }
    },
    getRowsNested(model,childsField){
      let {getRowId,getRowParentId} = getProps();
      if(!getRowParentId){return model}
      var convertModelRecursive = (array,parentId,parentObject)=>{
        for(let i = 0; i < array.length; i++){
          let row = array[i];
          let rowParentId = getRowParentId(row);
          if(rowParentId !== parentId){continue;}
          let rowId = getRowId(row);
          row[childsField] = [];
          parentObject.push(row);
          array.splice(i,1);
          i--;
          convertModelRecursive([...array],rowId,row[childsField])
        }
      }
      var result = [];
      convertModelRecursive([...model],undefined,result);
      return result;
    },
    getRowsBySort(rows,sorts){
      if(!sorts.length){return rows}
      return rows.sort((a,b)=>{
        for (let i = 0; i < sorts.length; i++){
          let {getValue,dir,onChange} = sorts[i];
          if(onChange){continue}
          let aValue = $$.getCellValue(a,getValue),bValue = $$.getCellValue(b,getValue);
          if ( aValue < bValue ){return -1 * (dir === 'dec'?-1:1);}
          if ( aValue > bValue ){return 1 * (dir === 'dec'?-1:1);}
          if(i === sorts.length - 1){return 0;}
        }
        return 0;
      });
    },
    getRows(model,freezeMode){
      let rows = [];
      $$.realIndex = 0; 
      $$.freezeMode = freezeMode;
      $$.getRowsReq(model,rows,0,[],[]);
      let result = [];
      for(let i = 0; i < rows.length; i++){
        let list = rows[i];
        if(list[0].row._show === false){continue}
        let arr = list.filter((o)=>o.row._show !== false)
        if(arr.length){
          result.push(arr);
        }
        
      }
      return result;
    },
    getRootsByPaging(roots,index){
      let {paging} = getState();
      if(!paging){return roots}
      var length = paging.onChange?paging.count:roots.length;
      paging.pages = Math.ceil(length / paging.size);
      if(paging.number > paging.pages){paging.number = paging.pages;}
      if(paging.number < 1){paging.number = 1;}
      if(paging.onChange){return roots}//اگر پیجینگ آنچنج داشت تغییری در ردیف ها نده و اجازه بده تغییرات در آنچنج روی مدل ورودی انجام شود
      let start = (paging.number - 1) * paging.size;
      let end = start + paging.size;
      if(end > length){end = length;}
      index.real = start;
      return roots.slice(start,end);
    },
    getRootsByGroup(roots,groups){
      if(!groups.length){return roots}
      var {groupsOpen} = getState();
      function msf(obj,_level,parents){
        if(Array.isArray(obj)){
          groupedRows = groupedRows.concat(obj);
        }
        else{
          for(var prop in obj){
            let newParents = parents.concat(prop);
            let _groupId = newParents.toString();
            groupsOpen[_groupId] = groupsOpen[_groupId] === undefined?true:groupsOpen[_groupId];
            groupedRows.push({
              _groupValue:prop,
              _groupId,
              _level,
              _opened:groupsOpen[_groupId],
            });
            if(groupsOpen[_groupId]){
              msf(obj[prop],_level + 1,newParents);
            }
          } 
        }
      }
      var newModel = {};
      for(let i = 0; i < roots.length; i++){
        let root = roots[i];
        var obj = newModel;
        let values = groups.map((group)=>$$.getCellValue(root[0].row,group.getValue,group.field));
        for(let j = 0; j < values.length; j++){
          let value = values[j];
          if(j === values.length - 1){
            obj[value] = obj[value] || [];  
            obj[value].push(root);
          }
          else{
            obj[value] = obj[value] || {};
            obj = obj[value];
          }
        }
      }
      var groupedRows = [];
      var _level = 0;
      msf(newModel,_level,[])
      return groupedRows;
    },
    getRowsByRoots(rows){
      var result = [];
      for(var i = 0; i < rows.length; i++){
        result = result.concat(rows[i]);
      }
      return result;
    },
    getFullCellStyle(columns){
      if(!columns){return {gridColumnStart:1,gridColumnEnd:2}}
      return {gridColumnStart:1,gridColumnEnd:columns.length + 1}
    },
    getNoData(columns){
      var {rowHeight,translate} = getProps();
      return <div className='aio-table-nodata' style={{...$$.getFullCellStyle(columns),height:rowHeight}}>{translate('No Data')}</div>
    }
  }
  return {
    exportToExcel:$$.exportToExcel,
    getDetails:$$.getDetails,
    getSliderCell:$$.getSliderCell,
    getOptionsCell:$$.getOptionsCell,
    getGanttCell:$$.getGanttCell,
    getCheckboxCell:$$.getCheckboxCell,
    handleOutsideClick:$$.handleOutsideClick,
    onScroll:$$.onScroll,
    getCardRowCount:$$.getCardRowCount,
    getOpenDictionary:$$.getOpenDictionary,
    getRowsBySort:$$.getRowsBySort,
    getGroups:$$.getGroups,
    getRootsByGroup:$$.getRootsByGroup,
    setColumnByStorage:$$.setColumnByStorage,
    getFilterResult:$$.getFilterResult,
    getLoading:$$.getLoading,
    cubes2:$$.cubes2,
    getRow:$$.getRow,
    getRowById:$$.getRowById,
    getClient:$$.getClient,
    getStateByToggleAll:$$.getStateByToggleAll,
    getRootsByPaging:$$.getRootsByPaging,
    getRowsReq:$$.getRowsReq,
    getRowsNested:$$.getRowsNested,
    getRows:$$.getRows,
    getRootsByRows:$$.getRootsByRows,
    getRowsByRoots:$$.getRowsByRoots,
    toggleRow:$$.toggleRow,
    getFullCellStyle:$$.getFullCellStyle,
    getNoData:$$.getNoData,
    getSortsFromColumns:$$.getSortsFromColumns,
    getCellValue:$$.getCellValue,
    setCellValue:$$.setCellValue
  }
}
function aioTableGetSvg(type,conf = {}){
    let {className,flip,onClick,box = '0 0 24 24'} = conf;
    let style1 = {width:'1.05rem',height:'1.05rem'}
    style1.background = ''
    if(flip){
      style1.transform = 'scaleX(-1)';
      style1.transformOrigin = 'center center';
      
    }
    let style2 = {fill:'currentcolor'}
    let Attrs = {
      viewBox:box,role:"presentation",style:style1
    }
    if(className){Attrs.className = className}
    if(onClick){Attrs.onClick = onClick}
    
    if(type === 'eye'){
     return (
       <svg {...Attrs}><path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'magnify'){
     return (
       <svg {...Attrs}><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'close'){
     return (
       <svg {...Attrs}><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'toggleAllPlus'){
     return (
       <svg {...Attrs}><path d="M18,8H8V18H6V8A2,2 0 0,1 8,6H18V8M14,2H4A2,2 0 0,0 2,4V14H4V4H14V2M22,12V20A2,2 0 0,1 20,22H12A2,2 0 0,1 10,20V12A2,2 0 0,1 12,10H20A2,2 0 0,1 22,12M20,15H17V12H15V15H12V17H15V20H17V17H20V15Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'toggleAllMinus'){
     return (
       <svg {...Attrs}><path d="M14,4H4V14H2V4A2,2 0 0,1 4,2H14V4M18,6H8A2,2 0 0,0 6,8V18H8V8H18V6M22,12V20A2,2 0 0,1 20,22H12A2,2 0 0,1 10,20V12A2,2 0 0,1 12,10H20A2,2 0 0,1 22,12M20,15H12V17H20V15Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'excel'){
     return (
       <svg {...Attrs}><path d="M21.17 3.25Q21.5 3.25 21.76 3.5 22 3.74 22 4.08V19.92Q22 20.26 21.76 20.5 21.5 20.75 21.17 20.75H7.83Q7.5 20.75 7.24 20.5 7 20.26 7 19.92V17H2.83Q2.5 17 2.24 16.76 2 16.5 2 16.17V7.83Q2 7.5 2.24 7.24 2.5 7 2.83 7H7V4.08Q7 3.74 7.24 3.5 7.5 3.25 7.83 3.25M7 13.06L8.18 15.28H9.97L8 12.06L9.93 8.89H8.22L7.13 10.9L7.09 10.96L7.06 11.03Q6.8 10.5 6.5 9.96 6.25 9.43 5.97 8.89H4.16L6.05 12.08L4 15.28H5.78M13.88 19.5V17H8.25V19.5M13.88 15.75V12.63H12V15.75M13.88 11.38V8.25H12V11.38M13.88 7V4.5H8.25V7M20.75 19.5V17H15.13V19.5M20.75 15.75V12.63H15.13V15.75M20.75 11.38V8.25H15.13V11.38M20.75 7V4.5H15.13V7Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'sort'){
     return (
       <svg {...Attrs}><path d="M18 21L14 17H17V7H14L18 3L22 7H19V17H22M2 19V17H12V19M2 13V11H9V13M2 7V5H6V7H2Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'group'){
     return (
       <svg {...Attrs}><path d="M3,3H9V7H3V3M15,10H21V14H15V10M15,17H21V21H15V17M13,13H7V18H13V20H7L5,20V9H7V11H13V13Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'freeze'){
     return (
       <svg {...Attrs}><path d="M4 22H2V2H4V22M22 7H6V10H22V7M16 14H6V17H16V14Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'filter'){
     return (
       <svg {...Attrs}><path d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'filterActive'){
     return (
       <svg {...Attrs}><path d="M11 11L16.76 3.62A1 1 0 0 0 16.59 2.22A1 1 0 0 0 16 2H2A1 1 0 0 0 1.38 2.22A1 1 0 0 0 1.21 3.62L7 11V16.87A1 1 0 0 0 7.29 17.7L9.29 19.7A1 1 0 0 0 10.7 19.7A1 1 0 0 0 11 18.87V11M13 16L18 21L23 16Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'dots'){
     return (
       <svg {...Attrs}><path d="M16,12A2,2 0 0,1 18,10A2,2 0 0,1 20,12A2,2 0 0,1 18,14A2,2 0 0,1 16,12M10,12A2,2 0 0,1 12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12M4,12A2,2 0 0,1 6,10A2,2 0 0,1 8,12A2,2 0 0,1 6,14A2,2 0 0,1 4,12Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'chevronDown'){
     return (
       <svg {...Attrs}><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'chevronRight'){
     return (
       <svg {...Attrs}><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'doubleChevronRight'){
     return (
       <svg {...Attrs}><path d="M5.59,7.41L7,6L13,12L7,18L5.59,16.59L10.17,12L5.59,7.41M11.59,7.41L13,6L19,12L13,18L11.59,16.59L16.17,12L11.59,7.41Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'arrowUp'){
     return (
       <svg {...Attrs}><path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" style={style2}></path></svg>
     ) 
    }
    if(type === 'arrowDown'){
     return (
       <svg {...Attrs}><path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z" style={style2}></path></svg>
     ) 
    }
}