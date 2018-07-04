/*
* @Author: duqinzhi
* @Date:   2018-07-04 10:16:28
* @Last Modified by:   duqinzhi
* @Last Modified time: 2018-07-04 17:45:00
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
let isPromise = obj => obj.then;    //只要obj有then方法 我们就认为obj是promise
let promise = store => next => action =>{
	if(isPromise(action)){  //isPromise() 这是一个方法 判断是不是promise   
		return action.then((data)=>next(data));   //如果是promise 那么就执行then() 在then里面执行next
	}
	next(action);
}
let store = applyMiddleware(promise)(createStore)(counter);   
//这个store是返回的含有新的dispatch的store对象
//给applyMiddleware函数   传进去logger返回一个函数   传进去createStore返回一个函数   传进去reducer

//订阅
store.subscribe(function(){
	console.log(store.getState());
})

store.dispatch(new Promise((resolve,reject)=>{
	setTimeout(function(){  //异步任务
		resolve({type:'ADD'});     //开始时候是初始态  3秒之后执行成功态
	},3000)
}))


/* 实现异步的中间件
1. promise 中间件  
    如果传进来的action的类型是  promise  那么返回then执行next  action.then((data)=>next(data)) 
    如果传进来的action的类型是  其他      那么返回  next(action)  

2. 发射的时候  Promise对象  里面是异步代码 

3.订阅
 */