/*
* @Author: duqinzhi
* @Date:   2018-07-04 10:16:28
* @Last Modified by:   duqinzhi
* @Last Modified time: 2018-07-04 16:15:19
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

//中间件的标准写法
let logger = store => next => action =>{
	//  store: 原来的store   next : 老的dispatch   action:action
	console.log('before',store.getState());
	console.log(action)
	next(action);
	console.log('after',store.getState());
}
/*                                         对应redux里面的
 let logger = function(store){   //    middleware = middleware(store); 
	return function(next){     //let dispatch = middleware(store.dispatch)   得到了新的dispatch
		return function(action)
		}
	}
} 
*/

let store = applyMiddleware(logger)(createStore)(counter);   
//这个store是返回的含有新的dispatch的store对象
//给applyMiddleware函数   传进去logger返回一个函数   传进去createStore返回一个函数   传进去reducer

store.dispatch({type:'ADD'});   //调用的新的dispatch  新的dispatch就是上面的logger执行完后得到的了