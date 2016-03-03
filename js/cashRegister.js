(function(window,undefined){
	/**
	 * Goods Class
	 * @param {name} 商品名称
	 * @param {counts} 商品个数
	 * @param {unitPrice} 商品单价
	 * @param {category} 商品计量单位
	 * @param {barCode} 商品条形码
	 * Date 2016-03-02 22:00
	 * Author XueChen.Wang
	 */
	function Goods(name,counts,unitPrice,category,barCode){
		this.name = name;
		this.counts = counts;
		this.unitPrice = unitPrice;
		this.category = category;
		this.barCode = barCode;
	}

	Goods.prototype.getName = function(){
		return this.name;
	};
	Goods.prototype.getCount = function(){
		return this.count;
	};
	Goods.prototype.setCount = function(count){
		this.count = count;
	};
	Goods.prototype.getUnitPrice = function(){
		return this.unitPrice;
	};
	Goods.prototype.getCategory = function(){
		return this.category;
	};
	Goods.prototype.getBarCode = function(){
		return this.barCode;
	};
	var GoodsArray = [];
	/*
	**如果需要新添加商品信息，需在此处new Goods()之后调用GoodsArray.push()方法
	**仅就示例来说，暂时只添加了六种商品
	*/
	var goods1 = new Goods('苹果','1','5.5','斤','ITEM00003');
	var goods2 = new Goods('可口可乐','1','3','瓶','ITEM00001');
	var goods3 = new Goods('羽毛球','1','4','个','ITEM00002');
	var goods4 = new Goods('篮球','1','7','个','ITEM00004');
	var goods5 = new Goods('玩具熊','1','30','只','ITEM00005');
	var goods6 = new Goods('筷子','1','2','根','ITEM00006');

	GoodsArray.push(goods1);
	GoodsArray.push(goods2);
	GoodsArray.push(goods3);
	GoodsArray.push(goods4);
	GoodsArray.push(goods5);
	GoodsArray.push(goods6);

	//根据条形码从商品库GoodsArray中查询对应的名称等其他信息，返回一个商品Goods类
	function getInfoByBarCode(barCode){
		var i = GoodsArray.length;
		while(i--){
			if(Goods.prototype.getBarCode.call(GoodsArray[i]) == barCode){
				return GoodsArray[i];
			}else{
				// alert('no match');
			}
		}
	}

	var CashRegister = function(inputList,discountArray,fullCutListArray){
		this.input = inputList;
		this.discount = discountArray;
		this.fullCutArray = fullCutListArray;
		this._goodsList = [];
		this._finalList = [];

		//解析原始商品数组
		this._parseOriginList = function(){
			var count = 1;  
		    var distinctGoodsArray= new Array();//存放不重复的商品条码列表，如ITEM0001-3和ITEM0001-4暂时视为两种商品 
		    var sum = new Array(); // 存放不重复商品出现的次数
		    // var length = input.length;
		    for (var i = 0; i < input.length; i++) {   
		        for(var j=i+1;j<input.length;j++)  
		        {  
		            if (input[i] == input[j]) {  
		                count++;
		                input.splice(j, 1);   
		                j--;   
		            }  
		        }  
		        distinctGoodsArray[i] = input[i];//将当前的条形码存入到distinctGoodsArray数组中  
		        sum[i] = count;  //并且将有当前条码的个数存入sum数组中  
		        count =1;  //再将count重新赋值，进入下一个条码的判断  
		    }  
		    //计算输入的条码集合中不同条码出现的次数  
		    var i = distinctGoodsArray.length;
		    while (i--) {   
		       var goods = {};
		       if(distinctGoodsArray[i].indexOf('-') != -1){
		       		// console.log(Goods.prototype.getName.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0])));
		       		// console.log(distinctGoodsArray[i].split('-')[1]);
		       		goods = new Goods((Goods.prototype.getName.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0]))),
		       			Goods.prototype.getCount.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0])),
		       			Goods.prototype.getUnitPrice.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0])),
		       			Goods.prototype.getCategory.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0])),
		       			Goods.prototype.getBarCode.call(getInfoByBarCode(distinctGoodsArray[i].split('-')[0])));
		       		// console.log('sun[i] is :' + sum[i]);
		       		goods.setCount(parseInt(sum[i]) + parseInt(distinctGoodsArray[i].split('-')[1]));
		       }else{
		       		goods = new Goods(Goods.prototype.getName.call(getInfoByBarCode(distinctGoodsArray[i])),
		       			Goods.prototype.getCount.call(getInfoByBarCode(distinctGoodsArray[i])),
		       			Goods.prototype.getUnitPrice.call(getInfoByBarCode(distinctGoodsArray[i])),
		       			Goods.prototype.getCategory.call(getInfoByBarCode(distinctGoodsArray[i])),
		       			Goods.prototype.getBarCode.call(getInfoByBarCode(distinctGoodsArray[i])));
		       		goods.setCount(sum[i]);
		       }
		       
		       this._goodsList.push(goods);

		    }
		    return this._generatePrintList(this._goodsList);
		};

		//生成需要打印小票的购物List
		this._generatePrintList = function(printList){
			var k = printList.length;
			while(k --){
				var result = {};
				if(this.fullCutArray.contains(Goods.prototype.getBarCode.call(printList[k]))){//满足满二免一优惠	
					result.total = Math.round(Goods.prototype.getUnitPrice.call(printList[k]) * (Goods.prototype.getCount.call(printList[k]) - Math.floor((Goods.prototype.getCount.call(printList[k])) / 3)) * 100)/100;
					result.save = Math.round(Goods.prototype.getUnitPrice.call(printList[k]) * Math.floor(Goods.prototype.getCount.call(printList[k]) / 3) * 100)/100;
					result.name = Goods.prototype.getName.call(printList[k]);
					result.unitPrice = Goods.prototype.getUnitPrice.call(printList[k]) + '元';
					result.count = Goods.prototype.getCount.call(printList[k]);
					result.category = Goods.prototype.getCategory.call(printList[k]);
					result.isfullCutArray = true;
					result.isDiscount = false;
					result.freeCount = Math.floor(Goods.prototype.getCount.call(printList[k]) / 3);
				}else if(this.discount.contains(Goods.prototype.getBarCode.call(printList[k]))){//满足95折优惠商品
					result.total = Math.round(Goods.prototype.getUnitPrice.call(printList[k]) * Goods.prototype.getCount.call(printList[k]) * 0.95 * 100)/100;
					result.save = Math.round(Goods.prototype.getUnitPrice.call(printList[k]) * Goods.prototype.getCount.call(printList[k]) * 0.05 * 100)/100;
					result.name = Goods.prototype.getName.call(printList[k]);
					result.unitPrice = Goods.prototype.getUnitPrice.call(printList[k]) + '元';
					result.count = Goods.prototype.getCount.call(printList[k]);
					result.category = Goods.prototype.getCategory.call(printList[k]);
					result.isfullCutArray = false;
					result.isDiscount = true;
					result.freeCount = 0;
				}else{
					result.total = Math.round(Goods.prototype.getUnitPrice.call(printList[k]) * Goods.prototype.getCount.call(printList[k]) * 100)/100;
					result.save = 0;
					result.name = Goods.prototype.getName.call(printList[k]);
					result.unitPrice = Goods.prototype.getUnitPrice.call(printList[k]) + '元';
					result.count = Goods.prototype.getCount.call(printList[k]);
					result.category = Goods.prototype.getCategory.call(printList[k]);
					result.isfullCutArray = false;
					result.isDiscount = false;
					result.freeCount = 0;
				}
				this._finalList.push(result);
				
			}
			return this._printGoodsList();
		};

		// 打印商品信息
		this._printGoodsList = function(){
			var commonContent = '******<没钱赚商店>购物清单*****\n';;
			var fullCutArrayContent = '买二赠一商品：\n';
			var totalContent = '';
			var fullCutArrayFlag = false;
			var globalFlag = false;
			var totalPrice = 0;
			var savePrice = 0;

			var j = this._finalList.length;
			while(j--){
				var goodsContent = '';
				var freeContent = '';
				totalPrice += this._finalList[j].total;
				if(this._finalList[j].isfullCutArray){
					fullCutArrayFlag = true;
					globalFlag = true;
					goodsContent = '名称: ' + this._finalList[j].name + ', 数量：' + this._finalList[j].count + this._finalList[j].category + ', 单价：' + this._finalList[j].unitPrice + ', 小计：' + this._finalList[j].total + '(元)\n';
					commonContent += goodsContent;

					freeContent = '名称：' + this._finalList[j].name + ', 数量:' + this._finalList[j].freeCount + this._finalList[j].category + '\n';
					fullCutArrayContent += freeContent;
					savePrice += this._finalList[j].save;
				}else if(this._finalList[j].isDiscount){
					globalFlag = true;
					goodsContent = '名称: ' + this._finalList[j].name + ', 数量：' + this._finalList[j].count + this._finalList[j].category + ', 单价：' + this._finalList[j].unitPrice + ', 小计：' + this._finalList[j].total + '(元), 节省' + this._finalList[j].save + '(元)\n';
					commonContent += goodsContent;
					savePrice += this._finalList[j].save;
				}else{
					goodsContent = '名称: ' + this._finalList[j].name + ', 数量：' + this._finalList[j].count + this._finalList[j].category + ', 单价：' + this._finalList[j].unitPrice + ', 小计：' + this._finalList[j].total + '(元)\n';
					commonContent += goodsContent;
				}
			}
			totalPrice = Math.round(totalPrice * 100)/100;
			savePrice = Math.round(savePrice * 100)/100;

			commonContent += '------------------------------\n';//商品通用记录结束

			//添加买二免一商品记录
			if(fullCutArrayFlag){
				fullCutArrayContent += '------------------------------\n';//买二免一记录结束
				commonContent += fullCutArrayContent;
			}

			//添加总计和节省记录
			commonContent += '总计：' + totalPrice + '(元)\n';
			if(globalFlag){
				commonContent += '节省：' + savePrice + '(元)\n';
			}
			commonContent += '******************************\n';//总计和节省记录结束
			return commonContent;	

		};
	};
	
	CashRegister.prototype.getOrderList = function(){
		return this._parseOriginList();
	};

	Array.prototype.contains = function(value){
		for(i in this){
			if(this[i] == value) return true;
		}
		return false;
	};

	window.CashRegister = window.CashRegister || CashRegister;

})(window);