/*
* @Author: duqinzhi
* @Date:   2018-07-04 10:16:28
* @Last Modified by:   duqinzhi
* @Last Modified time: 2018-07-04 17:10:14
*/
import {createStore,applyMiddleware} from './redux.js';

//处理器函数
let counter = (state=0,action)=>{
	if(action === undefined) return state;

	switch(action.type){
		case 'ADD' : 
			return state+1;
		case 'SUB' :
			return state-1;
		default :
			return state;
	}
	
}
//中间件
let thunk = store => next => action =>{
	if(typeof action === 'function'){
		return action(next);   //如果异步执行  那么需要执行action，把dispatch传进去
	}
	return next(action);   //异步不满足的时候 ，直接就到用dispatch 方法就行
}
let store = applyMiddleware(thunk)(createStore)(counter);   
//这个store是返回的含有新的dispatch的store对象
//给applyMiddleware函数   传进去logger返回一个函数   传进去createStore返回一个函数   传进去reducer

//订阅
store.subscribe(function(){
	console.log(store.getState());
})

store.dispatch(function(dispatch){   //异步执行（3秒后才执行dispatch)
	setTimeout(function(){   //这是action给里面穿了dispatch
		dispatch({type:'ADD'})
	},3000)
});  


/* 实现异步的中间件
1. thunk 中间件  
    如果传进来的action的类型是  function  那么返回 action(next)
    如果传进来的action的类型是  其他      那么返回  next(action)  

2. 发射的时候  是一个匿名函数(参数是dispatch)  里面是异步代码 

3.订阅
 */