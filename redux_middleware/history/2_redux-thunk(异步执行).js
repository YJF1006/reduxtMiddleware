/*
* @Author: duqinzhi
* @Date:   2018-07-04 10:16:28
* @Last Modified by:   duqinzhi
* @Last Modified time: 2018-07-04 18:07:20
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
let logger1 = store=>next=>action=>{
	console.log('logger1 before',store.getState());
	next(action);
	console.log('logger1 aftrer',store.getState());
}
let logger2 = store=>next=>action=>{
	console.log('logger2 before',store.getState());
	next(action);
	console.log('logger2 after',store.getState());
}
//如果放入多个中间件，需要从左向右一次执行
let store = applyMiddleware(logger1,logger2)(createStore)(counter);   
//这个store是返回的含有新的dispatch的store对象
//给applyMiddleware函数   传进去logger返回一个函数   传进去createStore返回一个函数   传进去reducer

//订阅
store.subscribe(function(){
	console.log(store.getState());
})

store.dispatch({type:'ADD'});  


/* 实现异步的中间件
1. thunk 中间件  
    如果传进来的action的类型是  function  那么返回 action(next)
    如果传进来的action的类型是  其他      那么返回  next(action)  

2. 发射的时候  是一个匿名函数(参数是dispatch)  里面是异步代码 

3.订阅
 */