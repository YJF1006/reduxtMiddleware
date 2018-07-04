/*
* @Author: duqinzhi
* @Date:   2018-07-04 10:16:36
* @Last Modified by:   duqinzhi
* @Last Modified time: 2018-07-04 20:12:04
*/

// 原版的createState
let createStore = (reducer)=>{
	let state; //状态
	let listeners = [];   //监听者数组
	//1.获取状态函数
	let getState = ()=>state;  
	//2.订阅
	let subscribe = listener=>{
		listeners.push(listener);
		//返回一个取消订阅函数
		return ()=>{
			listeners = listeners.filter(item=> item!==listener) 
		}	 
	}
	//3.发射
	let dispatch = action=>{
		state = reducer(state,action);    //调用reducer处理器函数，传给新老状态
		listeners.forEach(l=>l());    //遍历执行监听函数 
	}
	//4.先调用一次发射获取默认值
	dispatch();   
	return {
		getState,
		subscribe,
		dispatch  //原来的dispatch，在增强版的createState里面 修改了这个，前面两个没有动
	}
}

//应用中间件(对createState的增强)  middlewares 是多个中间件的数组
let applyMiddleware = (...middlewares) =>createStore => 
	reducer =>{   
		let store = createStore(reducer);   
		middlewares = middlewares.map(middleware=>middleware(store));   //映射，逐个执行
		let dispatch = compose(...middlewares)(store.dispatch)   //包含所有中间件的逻辑
		return {   
			...store,dispatch             
		}
	}
//组合函数（）
function compose(...fns){        
		return function(...args){
			let last = fns.pop();  //取出fns数组里面的最后一个
			return fns.reduceRight(
				(composed,fn)=>{return fn(composed);},last(...args)
			)
	}
}
export {createStore,applyMiddleware}



/*
reduceRight()方法的功能和reduce()功能是一样的，不同的是reduceRight()从数组的末尾向前将数组中的数组项做累加。
	1. last运行的结果返回给composed作为参数，然后又执行
	
	2.组合函数距离说明
	let result =compose(sum,upper)('a','b');
		参数 ab  传给upper函数，返回的结果又传给 sum 最后返回的结果传给result
 */
