/*
* @Author: duqinzhi
* @Date:   2018-07-04 18:19:05
* @Last Modified by:   duqinzhi
* @Last Modified time: 2018-07-04 20:08:35
*/
let sum =(a,b)=>a+b;
let upper = str =>str.toUpperCase();   //改成大写
// let result = upper(sum('a','b')); 
 
let result =compose(sum,upper)('a','b');

console.log(result);  ///AB

function compose(...fns){   //[upper,sum]
	return function(...args){
		let last = fns.pop();  //取出fns数组里面的最后一个
		return fns.reduceRight(
			(composed,fn)=>{return fn(componsed);}			
			,last(...args)
		)
	}
}

/*
reduceRight()方法的功能和reduce()功能是一样的，不同的是reduceRight()从数组的末尾向前将数组中的数组项做累加。
	1. last运行的结果返回给composed作为参数，然后又执行

	let result =compose(sum,upper)('a','b');
		参数 a b  传给upper函数，返回的结果又传给 sum 最后返回的结果传给result
 */