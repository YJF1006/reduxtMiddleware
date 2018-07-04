/*
* @Author: duqinzhi
* @Date:   2018-07-04 10:16:36
* @Last Modified by:   duqinzhi
* @Last Modified time: 2018-07-04 10:32:59
*/
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
		dispatch
	}
}

export {createStore}