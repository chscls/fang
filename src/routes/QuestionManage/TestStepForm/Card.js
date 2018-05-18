import React, { Component } from 'react';
import { DragSource, DropTarget } from 'react-dnd';
import {Icon,Checkbox } from 'antd';
import ItemTypes from './ItemTypes';
const cardSource = {
    beginDrag(props) {
      return {
        id: props.id,
        index: props.index,
      };
    },
  };
  
  const cardTarget = {
    hover(props, monitor, component) {
      const dragIndex = monitor.getItem().index;
      const hoverIndex = props.index;
  
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
  
      // Determine rectangle on screen
      const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
  
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
  
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
  
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
  
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
  
      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex;
    },
  };
  
  @DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
  }))
  @DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))
  export default class Card extends React.PureComponent {
    render() {
        const { text, isDragging, connectDragSource, connectDropTarget,id,unit,classNum} = this.props;
        const opacity = isDragging ? 0 : 1;
    
        return (
            <div style={{width:'100%',opacity:opacity}}>
             <Checkbox value={this.props.qid}/>
            {this.props.content}
  { connectDragSource(connectDropTarget(<a title="按住不放可拖住调整顺序"><Icon type="retweet"  style={{fontSize:'15px',color:'#1FC8AE'}} /></a>))}
            </div>

        )

    }


  }