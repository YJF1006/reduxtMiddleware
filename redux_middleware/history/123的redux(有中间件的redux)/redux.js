/*
* @Author: duqinzhi
* @Date:   2018-07-04 10:16:36
* @Last Modified by:   duqinzhi
* @Last Modified time: 2018-07-04 16:12:55
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

//应用中间件(对createState的增强)
let applyMiddleware = middleware =>createStore => 
	reducer =>{   //用这个reduce作为参数的函数把原来的createState替换掉了
		let store = createStore(reducer);   //调用原来的createState得到一个仓库  是个老仓库
		middleware = middleware(store);   //  把老的store传进middleware  （对应到index.js里面logger调用里面  得到的是next函数）
		let dispatch = middleware(store.dispatch)  //改变后的dispatch
		return {   
			...store,dispatch              //对store解构(原来有三个属性)  用新的dispatch 覆盖掉老的dispatch
		}
	}

export {createStore,applyMiddleware}

/*
一： 参数问题的理解（applyMiddleware函数传进去新的dispatch(中间件)，返回函数把把原来的层级接上）
   1.applyMiddleware 对createState的增强的函数
   2. 把 middleware是中间件(新的dispatch)作为参数传进去，返回一个函数
   3. 把老的createState作为参数传进去，返回一个函数
   4.再把reducer作为参数传进去   这样相当于在原来createState的基础上，有了新的dispatch

二 ： 传入reducer之后返回的函数
	1.生成老的store
	2.把老的store 作为参数传给中间件 让中间件也有了store 
	3.把store.dispatch 传给中间件 
	4.返回的时候 把store展开，让新的dispatch覆盖了就得dispatch

	调用增强版的createState之后，返回的store(里面的dispatch已经变成了新的dispatch(就是第一次传的参数中间件))
 */