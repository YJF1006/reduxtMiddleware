/*
* @Author: duqinzhi
* @Date:   2018-07-04 10:16:28
* @Last Modified by:   duqinzhi
* @Last Modified time: 2018-07-04 20:34:02
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
	console.log('logger1 after',store.getState());
}
let logger2 = store=>next=>action=>{
	console.log('logger2 before',store.getState());
	next(action);
	console.log('logger2 after',store.getState());
}
// 如果放入多个中间件，需从左向右执行
let store = applyMiddleware(logger1,logger2)(createStore)(counter);   

store.subscribe(function(){
	console.log(store.getState());   //打印结果以及分析看下面
})

store.dispatch({type:'ADD'});   //这里的dispatch方法是logger1 的dispatch 因为从左往右执行


/* 打印结果以及说明
 *1. 打印结果
 *	logger1 before 0
	logger2 before 0
	1
	logger2 after 1
	logger1 after 1
 *
 * 2.结果的说明
 *   因为组件放的吸纳后顺序是  logger1 logger2 ,所以从左到右执行先执行logger1
 *   执行logger1时候   
 *   		先执行logger1  console.log('logger1 before',store.getState());   打印了  logger1 before 0
 *   		再执行logger1  next(action);                                     这里的next指向下一个dispatch
 *   																	    (logger2的，然后把action放在里面，开始执行logger2了)
 *    		再执行logger2  console.log('logger2 before',store.getState());   打印了  logger2 before 0
	        再执行logger2  next(action);                                     打印了  1     这里next执行{type:'ADD'}  因为右边没有了
	        再执行logger2  console.log('logger2 after',store.getState());    打印了  logger2 after   1                
 	
 			再执行logger1  console.log('logger1 after',store.getState());    打印了  logger1 after 1
 */


/*redux middleware的原理  见图三
	1.外边往里面一层层进，再一层层往外出  (logger1在外面，logger2在外面)
	所以  进入logger1，再进入logger2里面，从logger2里面出来，再出logger1里面出来
 */